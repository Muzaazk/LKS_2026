<?php

namespace App\Http\Controllers;

use App\Models\Society;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_card_number' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $user = Society::where('id_card_number', $request->id_card_number)->first();
        if (!$user || !password_verify($request->password, $user->password)) {
            return response()->json([
                'message' => 'ID Card Number or Password incorrect'
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        $user::where('id', $user->id)->update(['login_tokens' => $token]);
        return response()->json([
            'name' => $user->name,
            'born_date' => $user->born_date,
            'gender' => $user->gender,
            'address' => $user->address,
            'token' => $token,
            'regional' => $user->regional
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $request->user()->update(['login_tokens' => null]);
        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_card_number' => 'required|unique:societies|min:8|max:8',
            'password' => 'required',
            'name' => 'required',
            'born_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required',
            'regional_id' => 'required|exists:regionals,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $user = Society::create([
            'id_card_number' => $request->id_card_number,
            'password' => bcrypt($request->password),
            'name' => $request->name,
            'born_date' => $request->born_date,
            'gender' => $request->gender,
            'address' => $request->address,
            'regional_id' => $request->regional_id
        ]);

        $token = $user->createToken('api-token')->plainTextToken;
        $user::where('id', $user->id)->update(['login_tokens' => $token]);
        return response()->json([
            'user' => $user,
            'address' => $request->address,
            'token' => $token
        ], 201);
    }
}
