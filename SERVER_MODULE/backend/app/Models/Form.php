<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Form extends Model
{

    protected $fillable = [
        'name',
        'slug',
        'description',
        'limit_one_response',
        'creator_id'
    ];

    public $timestamps = false;
    public $casts = [
        'limit_one_response' => 'boolean'
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
    public function allowedDomains(): HasMany
    {
        return $this->hasMany(AllowedDomain::class);
    }
}
