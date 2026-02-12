<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Create form success',
            'data' => $category
        ], 200);
    }

    public function getAll() {
        $category = Category::all();
        return response()->json([
            'success' => true,
            'message' => 'List of categories',
            'data' => $category
        ], 200);
    }

    public function getId($id) {
        $category = Category::where('id', $id)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Get category by ID',
            'data' => $category
        ], 200);
    }

    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $findCategory = Category::where('id', $id)->first();

        if (!$findCategory) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $findCategory->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfullys',
            'data' => $findCategory
        ], 200);
    }

    public function delete($id) {
        $category = Category::where('id', $id)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfullys',
        ], 200);
    }
}
