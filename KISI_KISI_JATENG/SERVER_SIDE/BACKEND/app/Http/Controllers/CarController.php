<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Car;
use App\Models\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    //
    public function getCars()
    {
        $cars = Car::with('availableMonths')->get();
        return response()->json([
            'cars' => $cars
        ]);
    }


    public function getDetailCar($id)
    {
        $car = Car::where('id', $id)->with('availableMonths')->first();

        if (!$car) {
            return response()->json([
                'message' => 'car not found'
            ], 404);
        }

        return response()->json([
            'cars' => $car
        ], 200);
    }

    public function applying(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'instalment_id' => 'required',
            'months' => 'required',
            'notes' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 401);
        }

        $validation = Validation::where('society_id', $request->user()->id)->first();

        if (!$validation || $validation->status != 'accepted') {
            return response()->json([
                'message' => 'Your data validator must be accepted by validator before'
            ], 401);
        }

        $isApply = Application::where('society_id', $request->user()->id)->exists();

        if ($isApply) {
            return response()->json([
                'message' => 'Application for a instalment can only be once'
            ], 401);
        }

        $car = Car::where('id', $request->instalment_id)->first();
        $application = Application::create([
            'society_id' => $request->user()->id,
            'car_id' => $request->instalment_id,
            'month' => $request->months,
            'nominal' => $car->price,
            'notes' => $request->notes ?? null,
        ]);

        if ($application) {
            return response()->json([
                'message' => 'Applying for Instalment successful',
                'app' => $application
            ], 200);
        }
    }

    public function getApplication()
    {
        $instalments = Car::with('applications')->get();

        foreach ($instalments as $instalment) {
            $instalment->applications->makeHidden(['apply_status', 'created_at']);
        }
        return response()->json([
            'instalment' =>
            $instalments

        ], 200);
    }
}
