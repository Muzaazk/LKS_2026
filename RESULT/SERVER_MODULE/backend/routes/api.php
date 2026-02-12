<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/categories', [CategoryController::class, 'create']);
    Route::get('/categories', [CategoryController::class, 'getAll']);
    Route::get('/categories/{id}', [CategoryController::class, 'getId']);
    Route::patch('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'delete']);
});