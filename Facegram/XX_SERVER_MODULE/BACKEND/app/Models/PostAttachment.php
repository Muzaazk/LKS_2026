<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostAttachment extends Model
{
    //
    protected $fillable = [
        'storage_path',
        'post_id'
    ];
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
