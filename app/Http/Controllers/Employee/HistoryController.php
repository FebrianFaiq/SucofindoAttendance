<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Tampilkan riwayat kehadiran karyawan.
     * (FR-ATT-03)
     *
     * Include: tanggal, jam masuk/keluar, WFO/WFA, catatan kerjaan.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $attendances = Attendance::forEmployee($employee->id)
            ->where('check_in_at', '>=', now()->subMonth())
            ->orderByDesc('check_in_at')
            ->paginate(15)
            ->through(function ($attendance) use ($employee) {
                $checkIn = $attendance->check_in_at?->timezone('Asia/Jakarta');
                $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');

                return [
                    'id' => $attendance->id,
                    'date' => $checkIn?->translatedFormat('d M Y') ?? '-',
                    'clock_in' => $checkIn?->format('H:i'),
                    'clock_out' => $checkOut?->format('H:i'),
                    'type' => strtoupper($attendance->type ?? 'WFO'),
                    'project_name' => $employee->activeProject()?->name ?? '-',
                ];
            });

        return Inertia::render('employee/history', [
            'attendances' => $attendances,
        ]);
    }
}
