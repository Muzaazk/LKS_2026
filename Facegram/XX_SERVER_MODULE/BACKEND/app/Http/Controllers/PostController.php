<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    //
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'caption' => 'required',
            'attachments' => 'required|array',
            'attachments.*' => 'image|mimes:jpg,jpeg,webp,png,gif'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::transaction(function () use ($request) {
                $post = $request->user()->posts()->create([
                    'caption' => $request->caption
                ]);

                foreach ($request->file('attachments') as $img) {
                    $path = $img->store('posts', 'public');
                    $post->attachments()->create([
                        'storage_path' => $path
                    ]);
                }
            });
            return response()->json([
                'message' => 'Create post success'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Create post failed',
                'errors' => $e->getMessage()
            ], 422);
        }
    }

    public function delete(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }

        $post->delete();
        return response(null, 204);
    }

    public function get(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'nullable|integer|min:0',
            'size' => 'nullable|integer|numeric|min:1|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $perPage = $request->query('size', 10);
        $page = $request->query('page', 0);

        $post = Post::with('attachments', 'user')->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page + 1);

        return response()->json([
            'page' => $post->currentPage(),
            'size' => $perPage,
            'posts' => $post->items()
        ], 200);
    }
}
