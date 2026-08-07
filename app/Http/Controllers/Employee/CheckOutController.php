<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckOutController extends Controller
{
    /**
     * Tampilkan form Check Out.
     * (FR-ATT-02)
     */
    public function create(): Response
    {
        // TODO: Check if already checked in and not yet checked out
        return Inertia::render('employee/check-out');
    }

    /**
     * Proses Check Out.
     * Menyimpan foto, GPS, dan catatan kerjaan harian (wajib).
     */
    public function store(Request $request)
    {
        // TODO: Implement check-out logic
        // 1. Validate: photo, gps_lat, gps_lng, work_notes (required)
        // 2. Verify user has checked in today
        // 3. Store check-out data

        return redirect()->route('employee.dashboard');
    }
}
