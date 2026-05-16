<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;

use function PHPSTORM_META\map;

class FollowController extends Controller
{
    //
    public function follow(Request $request, $username)
    {
        $following = User::where('username', $username)->first();
        if (!$following) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }


        if ($following->id === $request->user()->id) {
            return response()->json([
                'message' => 'You are not allowed to follow yourself'
            ], 422);
        }

        $is_accepted = !$following->is_private;
        $isFollow = Follow::where('follower_id', $request->user()->id)
            ->where('following_id', $following->id)
            ->first();

        if ($isFollow) {
            return response()->json([
                'message' => 'Already following this user',
                'status' => $is_accepted ? 'following' : 'requested'
            ], 422);
        }


        Follow::create([
            'follower_id' => $request->user()->id,
            'following_id' => $following->id,
            'is_accepted' => $is_accepted
        ]);

        return response()->json([
            'message' => 'Follow success',
            'status' => $is_accepted ? 'following' : 'requested'
        ], 200);
    }

    public function unfollow(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $follow = Follow::where('following_id', $user->id)->where('follower_id', $request->user()->id)->first();

        if (!$follow) {
            return response()->json([
                'message' => 'You are not following the user'
            ], 422);
        }

        $follow->delete();
        return response(null, 204);
    }

    public function getFollowing(Request $request)
    {
        $following = $request->user()->following()->get();
        $following->makeHidden('pivot');

        if ($following->count() === 0) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'following' => $following
        ], 200);
    }
    public function getOtherFollowing(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        $following = $user->following()->get();
        $following->makeHidden('pivot');

        if ($following->count() === 0) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'following' => $following
        ], 200);
    }

    public function accept(Request $request, $username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $follow = Follow::where('follower_id', $user->id)
            ->where('following_id', $request->user()->id)->first();

        if (!$follow) {
            return response()->json([
                'message' => 'The user is not following you'
            ], 422);
        }

        if ($follow->is_accepted == true) {
            return response()->json([
                'message' => 'Follow request is already accepted'
            ], 422);
        }

        $follow->update([
            'is_accepted' => true
        ]);

        return response()->json([
            'message' => 'Follow request accepted'
        ], 200);
    }

    public function getFollower(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        $follower = $user->follower()->get();

        if (!$follower) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'followers' => $follower
        ], 200);
    }

    public function getPendingFollower(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        $follower = $user->pendingFollower()->get();

        if (!$follower) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'followers' => $follower
        ], 200);
    }
}
