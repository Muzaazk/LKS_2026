<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    //
    public function getAll() {
        $product = Product::all();
        return response()->json([
            'success' => true,
            'message' => 'List of product',
            'data' => $product
        ], 200);
    }

    public function getId($id) {
        $product = Product::where('id', $id)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Get product by ID',
            'data' => $product
        ], 200);
    }

    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:products,name',
            'description' => 'nullable',
            'price' => 'required|integer',
            'stock' => 'required|integer',
            'category_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'category_id' => $request->category_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Create form success',
            'data' => $product
        ], 200);
    }

    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:products,name',
            'description' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::where('id', $id)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price ?? $product->price,
            'stock' => $request->stock ?? $product->stock,
            'category_id' => $request->category_id ?? $product->category_id,

        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfullys',
            'data' => $product
        ], 200);
    }

    public function delete($id) {
        $product = Product::where('id', $id)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfullys',
        ], 200);
    }
}
