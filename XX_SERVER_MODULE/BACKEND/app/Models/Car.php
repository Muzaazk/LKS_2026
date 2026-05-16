<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    //
    protected $fillable = [
        'car_name',
        'brand',
        'price',
        'description'
    ];

    public function availableMonths()
    {
        return $this->hasMany(AvailableMonth::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
