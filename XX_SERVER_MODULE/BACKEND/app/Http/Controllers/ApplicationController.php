<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Car;
use App\Models\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    //
    public function applyInstalment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'instalment_id' =>  'required|exists:cars,id|min:1',
            'months' => 'required|min:1',
            'notes' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 401);
        }

        $validation = Validation::where('society_id', $request->user()->id)->first();

        if ($validation->status != 'accepted') {
            return response()->json([
                'message' => 'Your data validator must be accepted by validator before'
            ], 401);
        };

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
                'message' => 'Applying for Instalment successful'
            ], 200);
        }
    }

    public function getApplication()
    {
        $instalments = Car::with('applications')->get();
        $data = [];


        foreach ($instalments as $p) {
            $apps = $p->applications->map(function ($app) {
                return [
                    'month' => $app->month,
                    'nominal' => $app->nominal,
                    'apply_status' => $app->apply_status,
                    'notes' => $app->notes
                ];
            });

            $p->applications->makeHidden(['id', 'society_id', 'car_id', 'created_at']);
            $data[] = [
                'id' => $p->id,
                'car' => $p->car_name,
                'brand' => $p->brand,
                'price' => $p->price,
                'description' => $p->description,
                'applications' => $apps
            ];
        };

        return response()->json([
            'instalments' => $data
        ], 200);
    }
}
