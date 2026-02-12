<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    //
    public function getAll() {
        $transaction = Transaction::all();
        return response()->json([
            'success' => true,
            'message' => 'List of transaction',
            'data' => $transaction
        ], 200);
    }

    public function getId($id) {
        $transaction = Transaction::where('id', $id)->first();

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

    public function create(Request $request) {
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

        // ......
    }
    public function delete($id) {
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
