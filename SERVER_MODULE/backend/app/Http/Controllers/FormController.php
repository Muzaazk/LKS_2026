<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use App\Models\AllowedDomain;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forms = Form::all();
        return response()->json([

            'message' => 'Get all forms success',
            'forms' => $forms
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'slug' => [
                'required',
                'unique:forms,slug',
                'regex:/^[a-zA-Z0-9.-]+$/'
            ],
            'allowed_domains' => 'array',
            'description' => 'nullable',
            'limit_one_response' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        };

        $form = Form::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'limit_one_response' => $request->limit_one_response,
            'creator_id' => $request->user()->id
        ]);

        if ($request->has('allowed_domains')) {
            foreach ($request->allowed_domains as $allowed_domain) {
                AllowedDomain::create([
                    'form_id' => $form->id,
                    'domain' => $allowed_domain
                ]);
            }
        };

        return response()->json([
            'message' => 'Create form success',
            'form' => [
                'name' => $form->name,
                'slug' => $form->slug,
                'description' => $form->description,
                'limit_one_response' => $form->limit_one_response,
                'creator_id' => $form->creator_id,
                'id' => $form->id
            ]
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $slug)
    {
        $forms = Form::where('slug', $slug)->first();

        if (!$forms) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }

        $userEmail = $request->user()->email;
        $userDomain = substr(strrchr($userEmail, '@'), 1);

        $allowedDomains = $forms->allowedDomains()->pluck('domain')->toArray();
        if (count($allowedDomains) > 0 && !in_array($userDomain, $allowedDomains)) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }
        return response()->json([
            'message' => 'Get form success',
            'form' => [
                'id' => $forms->id,
                'name' => $forms->name,
                'slug' => $forms->slug,
                'description' => $forms->description,
                'limit_one_response' => $forms->limit_one_response,
                'creator_id' => $forms->creator_id,
                'allowed_domains' => $allowedDomains,
                'questions' => $forms->questions
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Form $form)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Form $form)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Form $form)
    {
        //
    }
}
