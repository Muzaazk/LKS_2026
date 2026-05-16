<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;

use function Laravel\Prompts\select;

class UserController extends Controller
{
    //
    public function getAllUser(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
            ->whereNotIn('id', function ($query) use ($request) {
                $query->select('following_id')->from('follows')
                    ->where('follower_id', $request->user()->id);
            })->get();

        return response()->json([
            'users' => $users
        ], 200);
    }
    public function getUser(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user
        ], 200);
    }

    public function getDetailUser(Request $request, $username)
    {
        $authUser = $request->user();

        $user = User::where('username', $username)->firstOrFail();

        $follow = Follow::where('follower_id', $authUser->id)
            ->where('following_id', $user->id)
            ->first();

        $followStatus = 'not_following';

        if ($follow) {
            if ($follow->is_accepted) {
                $followStatus = 'following';
            } else {
                $followStatus = 'requested';
            }
        }

        $canSeePosts = !$user->is_private || $followStatus === 'following';

        $data = [
            'id' => $user->id,
            'full_name' => $user->full_name,
            'username' => $user->username,
            'bio' => $user->bio,
            'is_private' => $user->is_private,
            'follow_status' => $followStatus,
            'followers_count' => $user->follower()->count(),
            'following_count' => $user->following()->count(),
        ];

        if ($canSeePosts) {
            $data['posts'] = $user->posts()->latest()->get();
        } else {
            $data['posts'] = [];
        }

        return response()->json($data);
    }
}
