<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Rsvp;
use Illuminate\Http\Request;
use App\Exports\RsvpExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;

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

    // --- DELETE RSVP FUNCTION (WITH HTML EMAIL NOTIFICATION) ---
    public function destroy($id)
    {
        $rsvp = \App\Models\Rsvp::find($id);

        if (!$rsvp) {
            return response()->json(['message' => 'RSVP not found'], 404);
        }

        // 1. Capture the details
        $guestName = $rsvp->name;
        $guestSide = ucfirst($rsvp->side);
        $phone = $rsvp->phone;
        $additionalGuests = $rsvp->additional_guests; // This should be an array

        // 2. Delete the record
        $rsvp->delete();

        // 3. Build the HTML Email Body
        try {
            // Main Guest Details Table
            $htmlBody = "
                <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;'>
                    <h2 style='color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;'>RSVP Deleted</h2>
                    <p>An RSVP has been permanently removed from your dashboard.</p>
                    
                    <table style='width: 100%; border-collapse: collapse; margin-bottom: 25px;'>
                        <tr>
                            <td style='padding: 10px; border: 1px solid #EAEAEA; background-color: #F8F9FA; font-weight: bold; width: 120px;'>Primary Guest</td>
                            <td style='padding: 10px; border: 1px solid #EAEAEA;'>{$guestName}</td>
                        </tr>
                        <tr>
                            <td style='padding: 10px; border: 1px solid #EAEAEA; background-color: #F8F9FA; font-weight: bold;'>Side</td>
                            <td style='padding: 10px; border: 1px solid #EAEAEA;'>{$guestSide}</td>
                        </tr>
                        <tr>
                            <td style='padding: 10px; border: 1px solid #EAEAEA; background-color: #F8F9FA; font-weight: bold;'>Phone</td>
                            <td style='padding: 10px; border: 1px solid #EAEAEA;'>{$phone}</td>
                        </tr>
                    </table>
            ";

            // If there are additional guests, build a second table for them!
            if (!empty($additionalGuests) && is_array($additionalGuests)) {
                $htmlBody .= "
                    <h3 style='color: #B59461; margin-bottom: 10px;'>Additional Guests</h3>
                    <table style='width: 100%; border-collapse: collapse; margin-bottom: 25px;'>
                        <thead>
                            <tr style='background-color: #F8F9FA;'>
                                <th style='padding: 10px; border: 1px solid #EAEAEA; text-align: center; width: 40px;'>#</th>
                                <th style='padding: 10px; border: 1px solid #EAEAEA; text-align: left;'>Guest Name</th>
                            </tr>
                        </thead>
                        <tbody>
                ";
                
                foreach ($additionalGuests as $index => $guest) {
                    $num = $index + 1;
                    $htmlBody .= "
                        <tr>
                            <td style='padding: 10px; border: 1px solid #EAEAEA; text-align: center; color: #888;'>{$num}</td>
                            <td style='padding: 10px; border: 1px solid #EAEAEA;'>{$guest}</td>
                        </tr>
                    ";
                }
                
                $htmlBody .= "</tbody></table>";
            }

            // Footer
            $htmlBody .= "
                    <p style='margin-top: 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #EAEAEA; padding-top: 20px;'>
                        This is an automated security notification from your Wedding Dashboard.
                    </p>
                </div>
            ";

            // 4. Send the HTML Email
            Mail::html($htmlBody, function ($message) use ($guestName) {
                $message->to('anu.sara.wedding@gmail.com')
                        ->subject("🚨 RSVP Deleted: {$guestName}");
            });

        } catch (\Exception $e) {
            // Fails silently on the front-end if email configuration drops
        }

        return response()->json([
            'status' => 'success',
            'message' => 'RSVP deleted successfully and HTML notification sent.'
        ], 200);
    }

    // --- BULK DELETE FUNCTION (WITH CONSOLIDATED HTML EMAIL) ---
    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids');

        if (empty($ids)) {
            return response()->json(['message' => 'No RSVPs selected'], 400);
        }

        $rsvps = \App\Models\Rsvp::whereIn('id', $ids)->get();

        if ($rsvps->isEmpty()) {
            return response()->json(['message' => 'No matching RSVPs found'], 404);
        }

        // 1. Build the Consolidated HTML Email Body
        $htmlBody = "
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;'>
                <h2 style='color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;'>Bulk RSVP Deletion</h2>
                <p><strong>" . count($rsvps) . " RSVP(s)</strong> have been permanently removed from your dashboard.</p>
        ";

        foreach ($rsvps as $rsvp) {
            $guestName = $rsvp->name;
            $guestSide = ucfirst($rsvp->side);
            $phone = $rsvp->phone;
            $additionalGuests = $rsvp->additional_guests;

            $htmlBody .= "
                <table style='width: 100%; border-collapse: collapse; margin-top: 20px; border: 2px solid #333;'>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #EAEAEA; background-color: #F8F9FA; font-weight: bold; width: 120px;'>Primary Guest</td>
                        <td style='padding: 10px; border: 1px solid #EAEAEA; font-weight: bold;'>{$guestName}</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #EAEAEA; background-color: #F8F9FA; font-weight: bold;'>Side</td>
                        <td style='padding: 10px; border: 1px solid #EAEAEA;'>{$guestSide}</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #EAEAEA; background-color: #F8F9FA; font-weight: bold;'>Phone</td>
                        <td style='padding: 10px; border: 1px solid #EAEAEA;'>{$phone}</td>
                    </tr>
                </table>
            ";

            if (!empty($additionalGuests) && is_array($additionalGuests)) {
                $htmlBody .= "
                    <h4 style='color: #B59461; margin: 10px 0 5px 0;'>+ Additional Guests</h4>
                    <table style='width: 100%; border-collapse: collapse; margin-bottom: 10px;'>
                ";
                foreach ($additionalGuests as $index => $guest) {
                    $num = $index + 1;
                    $htmlBody .= "
                        <tr>
                            <td style='padding: 6px 10px; border: 1px solid #EAEAEA; text-align: center; color: #888; width: 40px;'>{$num}</td>
                            <td style='padding: 6px 10px; border: 1px solid #EAEAEA;'>{$guest}</td>
                        </tr>
                    ";
                }
                $htmlBody .= "</table>";
            }
        }

        $htmlBody .= "
                <p style='margin-top: 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #EAEAEA; padding-top: 20px;'>
                    This is an automated security notification from your Wedding Dashboard.
                </p>
            </div>
        ";

        // 2. Delete the records from the database
        \App\Models\Rsvp::whereIn('id', $ids)->delete();

        // 3. Send the single HTML Email
        try {
            Mail::html($htmlBody, function ($message) use ($rsvps) {
                $count = count($rsvps);
                $message->to('anu.sara.wedding@gmail.com')
                        ->subject("🚨 {$count} RSVP(s) Deleted");
            });
        } catch (\Exception $e) {}

        return response()->json([
            'status' => 'success',
            'message' => count($rsvps) . ' RSVP(s) deleted successfully.'
        ], 200);
    }
}
