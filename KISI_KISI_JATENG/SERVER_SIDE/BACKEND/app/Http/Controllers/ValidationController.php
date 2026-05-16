<?php

namespace App\Http\Controllers;

use App\Models\Validation;
use Illuminate\Http\Request;

class ValidationController extends Controller
{
    //
    public function requestValidation(Request $request)
    {
        $user = Validation::where('society_id', $request->user()->id)->exists();

        if ($user) {
            return response()->json([
                'message' => 'you can only once send the request'
            ], 422);
        }

        $request->validate([
            'job' => 'required',
            'job_description' => 'required',
            'income' => 'required|numeric',
            'reason_accepted' => 'required',
        ]);

        $validation = Validation::create([
            'society_id' => $request->user()->id,
            'validator_id' => null,
            'status' => 'pending',
            'job' => $request->job,
            'job_description' => $request->job_description,
            'income' => $request->income,
            'reason_accepted' => $request->reason_accepted,
            'validator_notes' => ""
        ]);

        if ($validation) {
            return response()->json([
                'message' => 'Request data validation sent successful'
            ], 200);
        }
    }

    public function getValidation()
    {
        $validations = Validation::with('validator')->get();
        $data = [];

        foreach ($validations as $validation) {
            $data[] = [
                'id' => $validation->id,
                'status' => $validation->status,
                'job' => $validation->job,
                'job_description' => $validation->job_description,
                'income' => $validation->income,
                'reason_accepted' => $validation->reason_accepted,
                'validator_notes' => $validation->validator_notes,
                'validator' => $validation->validator
            ];
        }

        return response()->json([
            'validation' => $data
        ], 200);
    }
}
