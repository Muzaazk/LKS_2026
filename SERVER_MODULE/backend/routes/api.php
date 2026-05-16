<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\QuestionController;
use App\Models\Question;

Route::prefix('/v1')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    });
    Route::middleware('auth:sanctum')->group(function () {
        // form 
        Route::post('/forms', [FormController::class, 'create']);
        Route::get('/forms', [FormController::class, 'index']);
        Route::get('/forms/{slug}', [FormController::class, 'show']);

        // Question 
        Route::post('/forms/{slug}/questions', [QuestionController::class, 'create']);
        Route::delete('/forms/{slug}/questions/{id}', [QuestionController::class, 'destroy']);
    });
});
