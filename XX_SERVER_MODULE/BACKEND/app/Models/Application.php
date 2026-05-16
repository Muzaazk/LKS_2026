<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    //
    protected $fillable = [
        'society_id',
        'car_id',
        'month',
        'nominal',
        'notes',
        'apply_status',
        'created_at'
    ];

    public $timestamps = false;
}
