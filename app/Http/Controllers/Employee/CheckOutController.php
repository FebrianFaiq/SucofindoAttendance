<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\CheckOutRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
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
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee?->todayAttendance();

        return Inertia::render('employee/check-out', [
            'hasCheckedIn' => $todayAttendance !== null,
            'alreadyCheckedOut' => $todayAttendance?->check_out_at !== null,
            'todayAttendance' => $todayAttendance ? [
                'id' => $todayAttendance->id,
                'type' => $todayAttendance->type,
                'check_in_at' => $todayAttendance->check_in_at?->toIso8601String(),
                'check_out_at' => $todayAttendance->check_out_at?->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Proses Check Out.
     * Menyimpan catatan kerjaan harian, foto, dan lokasi GPS (wajib).
     */
    public function store(CheckOutRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee->todayAttendance();

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('attendances/checkout', 'public');
        }

        $todayAttendance->update([
            'check_out_at' => now(),
            'work_notes' => $request->validated('work_notes'),
            'check_out_evidence' => $photoPath,
            'check_out_latitude' => $request->validated('gps_lat'),
            'check_out_longitude' => $request->validated('gps_lng'),
        ]);

        return redirect()->route('employee.dashboard')
            ->with('success', 'Check-out berhasil dicatat.');
    }
}
