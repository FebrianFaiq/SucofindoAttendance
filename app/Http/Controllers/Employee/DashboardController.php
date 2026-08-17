<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard karyawan.
     * Ringkasan status kehadiran hari ini, proyek aktif, riwayat terbaru.
     */
    public function __invoke(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee?->todayAttendance();
        $activeProject = $employee?->activeProject();

        // Ambil 5 record kehadiran terbaru untuk tabel "Aktivitas Terbaru"
        $recentAttendances = $employee
            ? $employee->attendances()
                ->orderByDesc('check_in_at')
                ->limit(5)
                ->get()
                ->map(function ($attendance) use ($employee) {
                    $checkIn = $attendance->check_in_at?->timezone('Asia/Jakarta');
                    $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');

                    // Tentukan status: hanya 2 jenis
                    $status = $checkOut ? 'Sudah Clock Out' : 'Belum Clock Out';

                    // Hitung durasi kerja
                    $duration = null;
                    if ($checkIn && $checkOut) {
                        $diff = $checkIn->diff($checkOut);
                        $duration = $diff->h . 'j ' . $diff->i . 'm';
                    }

                    // Ambil proyek aktif saat itu (gunakan proyek aktif saat ini sebagai fallback)
                    $project = $employee->activeProject();

                    return [
                        'id' => $attendance->id,
                        'date' => $checkIn?->translatedFormat('d M Y'),
                        'date_raw' => $checkIn?->format('Y-m-d'),
                        'clock_in' => $checkIn?->format('H:i'),
                        'clock_out' => $checkOut?->format('H:i'),
                        'status' => $status,
                        'is_late' => false, // deprecated
                        'type' => strtoupper($attendance->type ?? 'WFO'),
                        'project_name' => $project?->name ?? '-',
                        'duration' => $duration,
                    ];
                })
            : collect();

        // Data clock-in/clock-out hari ini
        $clockInTime = $todayAttendance?->check_in_at?->timezone('Asia/Jakarta')->format('H:i');
        $clockOutTime = $todayAttendance?->check_out_at?->timezone('Asia/Jakarta')->format('H:i');

        // Hitung total durasi hari ini
        $totalDuration = '0j 0m';
        if ($todayAttendance?->check_in_at && $todayAttendance?->check_out_at) {
            $diff = $todayAttendance->check_in_at->diff($todayAttendance->check_out_at);
            $totalDuration = $diff->h . 'j ' . $diff->i . 'm';
        } elseif ($todayAttendance?->check_in_at) {
            $diff = $todayAttendance->check_in_at->diff(now());
            $totalDuration = $diff->h . 'j ' . $diff->i . 'm';
        }

        return Inertia::render('employee/dashboard', [
            'todayAttendance' => $todayAttendance,
            'activeProject' => $activeProject,
            'hasCheckedIn' => $todayAttendance !== null,
            'hasCheckedOut' => $todayAttendance?->check_out_at !== null,
            'clockInTime' => $clockInTime,
            'clockOutTime' => $clockOutTime,
            'totalDuration' => $totalDuration,
            'recentAttendances' => $recentAttendances,
            'detectedLocation' => 'Kantor Pusat Jakarta',
        ]);
    }
}
