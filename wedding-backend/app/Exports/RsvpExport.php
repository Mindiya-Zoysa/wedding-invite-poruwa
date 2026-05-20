<?php

namespace App\Exports;

use App\Models\Rsvp;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RsvpExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filter;

    // Receive the filter from the controller
    public function __construct($filter = 'all')
    {
        $this->filter = $filter;
    }

    public function collection()
    {
        $query = Rsvp::orderBy('created_at', 'desc');
        
        // Apply the filter
        if ($this->filter === 'yes') {
            $query->where('attending', 'yes');
        } elseif ($this->filter === 'no') {
            $query->where('attending', 'no');
        }

        return $query->get();
    }

    // Map each row so the JSON array turns into a readable string
    public function map($rsvp): array
    {
        return [
            $rsvp->id,
            $rsvp->name,
            $rsvp->phone,
            $rsvp->side,
            $rsvp->attending,
            $rsvp->guest_count,
            // Implode the array to a comma-separated string, or leave empty
            is_array($rsvp->additional_guests) ? implode(', ', $rsvp->additional_guests) : '',
            $rsvp->message,
            $rsvp->created_at->format('Y-m-d H:i'),
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Primary Name',
            'Phone',
            'Side',
            'Attending',
            'Total Party Size',
            'Additional Guests',
            'Message',
            'Date Submitted'
        ];
    }
}