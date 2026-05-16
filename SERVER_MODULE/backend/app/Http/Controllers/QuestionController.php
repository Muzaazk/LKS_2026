<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Models\AllowedDomain;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $slug)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'choice_type' => [
                'required',
                'in:short answer,paragraph,date,multiple choice,dropdown,checkboxes'
            ],
            'choices' => [
                'required_if:choice_type,multiple choice,dropdown,checkboxes',
                'array',
            ],
            'choices.*' => 'string',
            'is_required' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $form = Form::where('slug', $slug)->first();
        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }

        if ($form->creator_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }

        $question = Question::create([
            'form_id' => $form->id,
            'name' => $request->name,
            'choice_type' => $request->choice_type,
            'choices' => $request->choices,
            'is_required' => $request->is_required
        ]);
        if ($question) {
            return response()->json([
                'message' => 'Add question success',
                'question' => $question
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $slug, $id)
    {
        $form = Form::where('slug', $slug)->first();

        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }
        $question = $form->questions->where('id', $id)->first();
        if (!$question) {
            return response()->json([
                'message' => 'Question not found'
            ], 404);
        }
        if ($form->creator_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }

        $question->delete();
        return response()->json([
            'message' => 'Remove question success'
        ], 200);
    }
}
