<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Dashboard API — Ringkasan kehadiran hari ini.
 *
 * Logika identik dengan Employee\DashboardController (web),
 * hanya saja return JSON alih-alih Inertia response.
 */
class DashboardController extends Controller
{
    /**
     * GET /api/v1/dashboard
     */
    public function __invoke(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        if (! $employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profil karyawan tidak ditemukan.',
            ], 404);
        }

        $todayAttendance = $employee->todayAttendance();
        $activeProject = $employee->activeProject();

        // Ambil 7 record kehadiran terbaru
        $recentAttendances = $employee
            ->attendances()
            ->where('check_in_at', '>=', now()->subWeek())
            ->orderByDesc('check_in_at')
            ->get()
            ->map(function ($attendance) use ($employee) {
                $checkIn = $attendance->check_in_at?->timezone('Asia/Jakarta');
                $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');

                $status = $checkOut ? 'Sudah Clock Out' : 'Belum Clock Out';

                $duration = null;
                if ($checkIn && $checkOut) {
                    $diff = $checkIn->diff($checkOut);
                    $duration = $diff->h.'j '.$diff->i.'m';
                }

                $isIntern = $employee->user?->role === 'intern';
                $projectName = $isIntern
                    ? 'Bidang: '.($employee->division ?? '-')
                    : ($employee->activeProject()?->name ?? '-');

                return [
                    'id' => $attendance->id,
                    'date' => $checkIn?->translatedFormat('d M Y'),
                    'date_raw' => $checkIn?->format('Y-m-d'),
                    'clock_in' => $checkIn?->format('H:i'),
                    'clock_out' => $checkOut?->format('H:i'),
                    'status' => $status,
                    'type' => strtoupper($attendance->type ?? 'WFO'),
                    'project_name' => $projectName,
                    'duration' => $duration,
                ];
            });

        // Data clock-in/clock-out hari ini
        $clockInTime = $todayAttendance?->check_in_at?->timezone('Asia/Jakarta')->format('H:i');
        $clockOutTime = $todayAttendance?->check_out_at?->timezone('Asia/Jakarta')->format('H:i');

        // Hitung total durasi hari ini
        $totalDuration = '0j 0m';
        if ($todayAttendance?->check_in_at && $todayAttendance?->check_out_at) {
            $diff = $todayAttendance->check_in_at->diff($todayAttendance->check_out_at);
            $totalDuration = $diff->h.'j '.$diff->i.'m';
        } elseif ($todayAttendance?->check_in_at) {
            $diff = $todayAttendance->check_in_at->diff(now());
            $totalDuration = $diff->h.'j '.$diff->i.'m';
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'has_checked_in' => $todayAttendance !== null,
                'has_checked_out' => $todayAttendance?->check_out_at !== null,
                'clock_in_time' => $clockInTime,
                'clock_out_time' => $clockOutTime,
                'total_duration' => $totalDuration,
                'today_attendance' => $todayAttendance ? [
                    'id' => $todayAttendance->id,
                    'type' => $todayAttendance->type,
                    'check_in_at' => $todayAttendance->check_in_at?->toIso8601String(),
                    'check_out_at' => $todayAttendance->check_out_at?->toIso8601String(),
                    'work_notes' => $todayAttendance->work_notes,
                ] : null,
                'active_project' => $activeProject ? [
                    'id' => $activeProject->id,
                    'name' => $activeProject->name,
                    'code' => $activeProject->code ?? null,
                ] : null,
                'recent_attendances' => $recentAttendances,
            ],
        ]);
    }
}
