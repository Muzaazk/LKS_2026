<?php

namespace App\Http\Controllers;

use App\Models\Society;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        $request->validate([
            'id_card_number' => 'required',
            'password' => 'required'
        ]);

        $user = Society::where('id_card_number', $request->id_card_number)->first();


        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'ID Card Number or Password incorrect'
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        if ($token) {
            return response()->json([
                'name' => $user->name,
                'born_date' => $user->born_date,
                'gender' => $user->gender,
                'address' => $user->address,
                'token' => $token,
                'regional' => $user->regional
            ], 200);
        }
    }

    public function logout(Request $request)
    {
        $logout = $request->user()->tokens()->delete();
        if ($logout) {
            return response()->json([
                'Logout success'
            ], 200);
        }
    }
}
