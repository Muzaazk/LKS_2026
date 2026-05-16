<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Validation;
use Illuminate\Http\Request;

class InstalmentController extends Controller
{
    //
    public function getInstalment(Request $request)
    {
        $validation = Validation::where('society_id', $request->user()->id)->first();

        if ($validation->status != 'accepted') {
            return response()->json([
                'message' => 'Your data validator must be accepted by validator before'
            ], 422);
        };

        $data = [];
        $instalments = Car::with('availableMonths')->get();

        foreach ($instalments as $i) {
            $i->availableMonths->makeHidden(['id', 'car_id']);
            $data[] = [
                'id' => $i->id,
                'car' => $i->car_name,
                'brand' => $i->brand,
                'price' => $i->price,
                'description' => $i->description,
                'available_months' => $i->availableMonths
            ];
        };

        return response()->json([
            'cars' => $data
        ], 200);
    }

    public function getDetailInstalment(Request $request, $id)
    {

        $validation = Validation::where('society_id', $request->user()->id)->first();

        if ($validation->status != 'accepted') {
            return response()->json([
                'message' => 'Your data validator must be accepted by validator before'
            ], 422);
        };

        $car = Car::where('id', $id)->with('availableMonths')->first();

        if (!$car) {
            return response()->json([
                'message' => 'Car not found'
            ], 404);
        }
        $data = [
            'id' => $car->id,
            'car' => $car->car_name,
            'brand' => $car->brand,
            'price' => $car->price,
            'description' => $car->description,
            'available_month' => $car->availableMonths
        ];

        $car->availableMonths->makeHidden(['id', 'car_id']);

        return response()->json([
            'instalment' => $data
        ], 200);
    }
}
