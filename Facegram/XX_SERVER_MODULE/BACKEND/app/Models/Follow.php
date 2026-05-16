<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follow extends Model
{
    //
    protected $fillable = [
        'is_accepted',
        'follower_id',
        'following_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id');
    }
}
