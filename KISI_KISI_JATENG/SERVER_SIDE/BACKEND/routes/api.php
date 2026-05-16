<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\ValidationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('/v1')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        // validation 
        Route::post('/validation', [ValidationController::class, 'requestValidation']);
        Route::get('/validations', [ValidationController::class, 'getValidation']);

        // instalment 
        Route::get('/instalment_cars', [CarController::class, 'getCars']);
        Route::get('/instalment_cars/{id}', [CarController::class, 'getDetailCar']);

        // application
        Route::post('/applications', [CarController::class, 'applying']);
        Route::get('/applications', [CarController::class, 'getApplication']);
    });
});
