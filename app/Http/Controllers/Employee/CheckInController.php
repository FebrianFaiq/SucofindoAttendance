<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\CheckInRequest;
use App\Models\Attendance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
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
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee?->todayAttendance();

        return Inertia::render('employee/check-in', [
            'alreadyCheckedIn' => $todayAttendance !== null,
            'todayAttendance' => $todayAttendance,
        ]);
    }

    /**
     * Proses Check In.
     * Menyimpan foto, GPS, status WFO/WFA, dan auto-tag proyek aktif.
     */
    public function store(CheckInRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $employee = $user->employee;

        // Simpan foto bukti check-in
        $photoPath = $request->file('photo')->store('attendance/check-in', 'public');

        Attendance::create([
            'employee_id' => $employee->id,
            'type' => $request->validated('type'),
            'check_in_at' => now(),
            'check_in_evidence' => $photoPath,
            'check_in_latitude' => $request->validated('gps_lat'),
            'check_in_longitude' => $request->validated('gps_lng'),
        ]);

        return redirect()->route('employee.dashboard')
            ->with('success', 'Check-in berhasil dicatat.');
    }
}
