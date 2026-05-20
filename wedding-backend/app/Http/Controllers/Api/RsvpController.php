<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rsvp;
use Illuminate\Http\Request;
use App\Exports\RsvpExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class RsvpController extends Controller
{
    // --- NEW: Fetch all RSVPs for the Dashboard ---
    public function index()
    {
        // Get all RSVPs, newest first
        $rsvps = \App\Models\Rsvp::orderBy('created_at', 'desc')->get();
        return response()->json($rsvps);
    }

    public function store(Request $request)
    {
        // 1. Validate the incoming data (now including the array of guests)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'side' => 'required|string|in:yasara,anuruddha',
            'attending' => 'required|string|in:yes,no',
            'message' => 'nullable|string',
            'guestCount' => 'nullable', // From React (can be "1", "2", or "5+")
            'additionalGuests' => 'nullable|array', // The array of extra names
            'additionalGuests.*' => 'nullable|string|max:255' // Each name in the array must be a string
        ]);

        // 2. Map React variables to Database columns
        // We convert "5+" to 5 so the database doesn't crash on an integer column
        $totalCount = $request->input('guestCount') === '5+' ? 5 : (int) $request->input('guestCount', 1);

        $rsvpData = [
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'side' => $validated['side'],
            'attending' => $validated['attending'],
            'message' => $validated['message'] ?? null,
            'guest_count' => $validated['attending'] === 'no' ? 0 : $totalCount,
            'additional_guests' => $validated['additionalGuests'] ?? [],
        ];

        // 3. Save to the database
        $rsvp = Rsvp::create($rsvpData);

        // 4. Return success
        return response()->json([
            'status' => 'success',
            'message' => 'RSVP saved successfully!',
            'data' => $rsvp
        ], 201);
    }

    // --- EXPORT EXCEL FUNCTION ---
    public function export(Request $request) 
    {
        $filter = $request->query('filter', 'all'); // Get the filter, default to 'all'
        
        return Excel::download(new RsvpExport($filter), 'wedding_rsvps.xlsx');
    }

    // --- EXPORT PDF FUNCTION ---
    public function exportPdf(Request $request)
    {
        $filter = $request->query('filter', 'all'); // Get the filter from React

        // 1. Start the base queries
        $yasaraQuery = \App\Models\Rsvp::where('side', 'yasara')->orderBy('name', 'asc');
        $anuruddhaQuery = \App\Models\Rsvp::where('side', 'anuruddha')->orderBy('name', 'asc');

        // 2. Apply the filters if requested
        if ($filter === 'yes') {
            $yasaraQuery->where('attending', 'yes');
            $anuruddhaQuery->where('attending', 'yes');
        } elseif ($filter === 'no') {
            $yasaraQuery->where('attending', 'no');
            $anuruddhaQuery->where('attending', 'no');
        }

        // 3. Execute the queries
        $yasaraGuests = $yasaraQuery->get();
        $anuruddhaGuests = $anuruddhaQuery->get();

        // 4. Load the PDF View
        $pdf = app('dompdf.wrapper')->loadView('pdf.rsvps', [
            'yasaraGuests' => $yasaraGuests,
            'anuruddhaGuests' => $anuruddhaGuests,
            'filter' => $filter // Pass the filter to the blade file so we can update the title
        ]);

        return $pdf->download('Wedding_Guest_List.pdf');
    }
}