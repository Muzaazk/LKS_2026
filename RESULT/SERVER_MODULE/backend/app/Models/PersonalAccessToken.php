<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalAccessToken extends Model
{
    //
    public function currentAccessToken(): BelongsTo
    {
        return $this->belongsTo(User::class,  'id', 'tokenable_id');
    }
}
