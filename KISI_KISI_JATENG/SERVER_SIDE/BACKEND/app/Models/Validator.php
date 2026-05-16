<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Validator extends Model
{
    //      
    protected $fillable = [
        'user_id',
        'role',
        'name'
    ];
    public $timestamps = false;

    public function validations()
    {
        return $this->hasMany(Validation::class);
    }
}
