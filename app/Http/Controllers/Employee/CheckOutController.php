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
                'check_in_at' => $todayAttendance->check_in_at?->toIso8601String(),
                'check_out_at' => $todayAttendance->check_out_at?->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Proses Check Out.
     * Menyimpan catatan kerjaan harian (wajib).
     */
    public function store(CheckOutRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee->todayAttendance();

        $todayAttendance->update([
            'check_out_at' => now(),
            'work_notes' => $request->validated('work_notes'),
        ]);

        return redirect()->route('employee.dashboard')
            ->with('success', 'Check-out berhasil dicatat.');
    }
}
