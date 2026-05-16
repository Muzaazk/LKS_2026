<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailableMonth extends Model
{
    //
    protected $fillable = [
        'car_id',
        'month',
        'description'
    ];
    public $timestamps = false;

    public function Car()
    {
        return $this->belongsTo(Car::class);
    }
}
