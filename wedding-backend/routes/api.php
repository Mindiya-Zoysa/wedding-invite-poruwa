<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RsvpController;

Route::get('/rsvps', [RsvpController::class, 'index']);
Route::post('/rsvp', [RsvpController::class, 'store']);

Route::get('/rsvp/export', [RsvpController::class, 'export']);
Route::get('/rsvp/export-pdf', [RsvpController::class, 'exportPdf']);
Route::delete('/rsvp/bulk', [RsvpController::class, 'bulkDestroy']);
Route::delete('/rsvp/{id}', [RsvpController::class, 'destroy']);
