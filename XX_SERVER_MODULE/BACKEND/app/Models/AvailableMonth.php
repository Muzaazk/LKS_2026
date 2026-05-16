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

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
