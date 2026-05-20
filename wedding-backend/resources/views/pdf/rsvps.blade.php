<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Wedding Guest List</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; font-size: 12px; }
        h1 { color: #B59461; text-align: center; font-family: serif; margin-bottom: 5px; }
        h2 { border-bottom: 2px solid #B59461; padding-bottom: 5px; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f9f6f0; color: #B59461; font-weight: bold; }
        .attending-yes { color: green; font-weight: bold; }
        .attending-no { color: red; font-weight: bold; }
        .page-break { page-break-after: always; }
        .stats { text-align: right; font-size: 14px; font-weight: bold; color: #555; margin-bottom: 10px; }
    </style>
</head>
<body>

    <h1>Yashara & Anuruddha</h1>
    <h2>Bride's Side (Yashara) 
        <span style="font-size: 14px; color: #888;">
            {{ $filter === 'yes' ? '- Attending Only' : ($filter === 'no' ? '- Declined Only' : '') }}
        </span>
    </h2>
    
    <div class="stats">
        Total Attending: {{ $yasaraGuests->where('attending', 'yes')->sum('guest_count') }}
    </div>

    <table>
        <thead>
            <tr>
                <th width="20%">Primary Guest</th>
                <th width="15%">Phone</th>
                <th width="10%">Party</th>
                <th width="30%">Extra Names</th>
                <th width="25%">Message</th>
            </tr>
        </thead>
        <tbody>
            @forelse($yasaraGuests as $guest)
                <tr>
                    <td>
                        {{ $guest->name }} 
                        @if($guest->attending === 'no')
                            <br><span class="attending-no">(Declined)</span>
                        @endif
                    </td>
                    <td>{{ $guest->phone }}</td>
                    <td style="text-align: center; font-weight: bold;">{{ $guest->guest_count }}</td>
                    <td>
                        @if(is_array($guest->additional_guests) && count($guest->additional_guests) > 0)
                            {{ implode(', ', $guest->additional_guests) }}
                        @else
                            -
                        @endif
                    </td>
                    <td>{{ $guest->message ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center;">No guests registered for this side yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="page-break"></div>

    <h1>Yashara & Anuruddha</h1>
    <h2>Groom's Side (Anuruddha)
        <span style="font-size: 14px; color: #888;">
            {{ $filter === 'yes' ? '- Attending Only' : ($filter === 'no' ? '- Declined Only' : '') }}
        </span>
    </h2>
    
    <div class="stats">
        Total Attending: {{ $anuruddhaGuests->where('attending', 'yes')->sum('guest_count') }}
    </div>

    <table>
        <thead>
            <tr>
                <th width="20%">Primary Guest</th>
                <th width="15%">Phone</th>
                <th width="10%">Party</th>
                <th width="30%">Extra Names</th>
                <th width="25%">Message</th>
            </tr>
        </thead>
        <tbody>
            @forelse($anuruddhaGuests as $guest)
                <tr>
                    <td>
                        {{ $guest->name }} 
                        @if($guest->attending === 'no')
                            <br><span class="attending-no">(Declined)</span>
                        @endif
                    </td>
                    <td>{{ $guest->phone }}</td>
                    <td style="text-align: center; font-weight: bold;">{{ $guest->guest_count }}</td>
                    <td>
                        @if(is_array($guest->additional_guests) && count($guest->additional_guests) > 0)
                            {{ implode(', ', $guest->additional_guests) }}
                        @else
                            -
                        @endif
                    </td>
                    <td>{{ $guest->message ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center;">No guests registered for this side yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
