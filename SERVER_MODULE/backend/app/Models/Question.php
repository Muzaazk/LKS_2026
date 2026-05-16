<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $fillable = [
        'form_id',
        'name',
        'choice_type',
        'choices',
        'is_required'
    ];

    public $timestamps = false;
    public $casts = [
        'choices' => 'array',
        'is_required' => 'boolean'
    ];
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }
}
