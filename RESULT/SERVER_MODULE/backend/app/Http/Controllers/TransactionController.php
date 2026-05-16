<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    //
    public function getAll()
    {
        $transaction = Transaction::all();
        return response()->json([
            'success' => true,
            'message' => 'List of transaction',
            'data' => $transaction
        ], 200);
    }

    public function getId(Request $request, $id)
    {
        $transaction = Transaction::with('transactionDetails.product')->find($id);
        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Get transaction by ID',
            'data' => $transaction
        ], 200);
    }

    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'payment_method' => 'required',
            'details' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            return DB::transaction(function () use ($request) {
                $productIds = collect($request->details)->pluck('product_id');
                $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

                $details = collect($request->details)->map(function ($item) use ($products) {
                    return [
                        'id'    => $item['product_id'],
                        'price' => $products[$item['product_id']]->price ?? 0,
                        'total' => $products[$item['product_id']]->price * $item['quantity'],
                        'qty'   => $item['quantity']
                    ];
                });

                $transaction_code = "TRX" . "-" . now()->format('Ymd') . "-" . sprintf('%03d', Transaction::latest()->first()->id ?? 1);
                $subtotal = collect($details)->pluck('total')->sum();

                $transaction = Transaction::create([
                    'transaction_code' => $transaction_code,
                    'transaction_date' => now(),
                    'total_amount' => $subtotal,
                    'payment_method' => $request->payment_method
                ]);

                foreach ($details as $dt) {
                    $product = Product::find($dt['id']);
                    if (!$product || $product->stock < $dt['qty']) {
                        throw new \Exception("Stok produk {$product->name} tidak mencukupi!");
                    }
                    TransactionDetails::create([
                        'quantity' => $dt['qty'],
                        'price' => $dt['price'],
                        'subtotal' => $dt['total'],
                        'transaction_id' => $transaction->id,
                        'product_id' => $dt['id']
                    ]);
                    Product::where('id', $dt['id'])->decrement('stock', $dt['qty']);
                }
                if ($transaction) {
                    return response()->json([
                        'success' => true,
                        'details' => $details
                    ]);
                }
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'failed',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    public function delete($id)
    {
        $transaction = Transaction::where('id', $id)->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfullys',
        ], 200);
    }
}
