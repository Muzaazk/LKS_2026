<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InstalmentController;
use App\Http\Controllers\ValidationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('/v1')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/validations', [ValidationController::class, 'requestValidation']);
        Route::get('/validations', [ValidationController::class, 'getValidation']);

        Route::get('/instalment_cars', [InstalmentController::class, 'getInstalment']);
        Route::get('/instalment_cars/{id}', [InstalmentController::class, 'getDetailInstalment']);

        Route::post('/applications', [ApplicationController::class, 'applyInstalment']);
        Route::get('/applications', [ApplicationController::class, 'getApplication']);
    });
});
