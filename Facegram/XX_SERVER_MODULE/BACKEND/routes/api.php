<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('/v1')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    });


    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/posts', [PostController::class, 'create']);
        Route::post('/posts/{id}', [PostController::class, 'delete']);
        Route::get('/posts', [PostController::class, 'get']);

        Route::post('/users/{username}/follow', [FollowController::class, 'follow']);
        Route::delete('/users/{username}/unfollow', [FollowController::class, 'unfollow']);
        Route::get('/following', [FollowController::class, 'getFollowing']);
        Route::get('/users/{username}/following', [FollowController::class, 'getOtherFollowing']);

        Route::put('/users/{username}/accept', [FollowController::class, 'accept']);
        Route::get('/users/{username}/followers', [FollowController::class, 'getFollower']);
        Route::get('/users/{username}/pending-followers', [FollowController::class, 'getPendingFollower']);

        Route::get('/users', [UserController::class, 'getAllUser']);
        Route::get('/user', [UserController::class, 'getUser']);
        Route::get('/users/{username}', [UserController::class, 'getDetailUser']);
    });
});
