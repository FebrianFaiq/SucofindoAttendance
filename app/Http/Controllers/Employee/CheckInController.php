<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckInController extends Controller
{
    /**
     * Tampilkan form Check In.
     * (FR-ATT-01)
     */
    public function create(): Response
    {
        // TODO: Check if already checked in today
        return Inertia::render('employee/check-in');
    }

    /**
     * Proses Check In.
     * Menyimpan foto, GPS, status WFO/WFA, dan auto-tag proyek aktif.
     */
    public function store(Request $request)
    {
        // TODO: Implement check-in logic
        // 1. Validate: photo, gps_lat, gps_lng, work_type (WFO/WFA)
        // 2. Check duplicate check-in
        // 3. Auto-tag active project (FR-PROJ-02)
        // 4. Flag late if after 08:00 (FR-FLAG-01)
        // 5. Store attendance record

        return redirect()->route('employee.dashboard');
    }
}
