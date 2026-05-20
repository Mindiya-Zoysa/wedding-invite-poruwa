<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    use HasFactory;

    // Allow mass assignment
    protected $fillable = [
        'name', 'phone', 'side', 'attending', 'message', 
        'guest_count', 'additional_guests'
    ];

    // Automatically handle the JSON array conversion
    protected $casts = [
        'additional_guests' => 'array',
    ];
}