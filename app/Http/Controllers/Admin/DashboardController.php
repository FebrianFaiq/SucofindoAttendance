<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Overtime;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard admin dengan KPI cards.
     * (FR-ADM-01, FR-ADM-02, FR-ADM-03)
     *
     * KPI Cards:
     * - Total Karyawan (aktif)
     * - Hadir Hari Ini
     * - WFO Hari Ini
     * - WFA Hari Ini
     * - Belum Check In
     * - Belum Check Out
     * - Lembur Hari Ini
     */
    public function __invoke(Request $request): Response
    {
        $totalPtt = Employee::whereHas('user', fn ($q) => $q->where('is_active', true)->where('role', '!=', 'intern'))->count();
        $totalInterns = Employee::whereHas('user', fn ($q) => $q->where('is_active', true)->where('role', 'intern'))->count();
        $todayAttendances = Attendance::today()->get();

        $checkedInToday = $todayAttendances->count();
        $wfoToday = $todayAttendances->where('type', 'WFO')->count();
        $wfaToday = $todayAttendances->where('type', 'WFA')->count();
        $overtimeToday = Overtime::whereDate('date', today())->count();

        // Trend Kehadiran 5 hari terakhir
        $trendData = [];
        for ($i = 4; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $count = Attendance::whereDate('check_in_at', $date)->count();
            $trendData[] = [
                'day' => $date->format('D'),
                'value' => $count
            ];
        }

        // Mode Kerja
        $workModeData = [
            ['name' => 'WFO', 'value' => $wfoToday, 'color' => '#035EA9'],
            ['name' => 'WFA', 'value' => $wfaToday, 'color' => '#CBD5E1'],
        ];

        $perPage = $request->query('per_page', 10);

        // Riwayat Kehadiran (Recent)
        $recentAttendances = Attendance::with(['employee.user', 'employee.projects' => function ($q) {
            $q->wherePivot('status', 'active');
        }])->today()->latest('check_in_at')->limit($perPage)->get()->map(function ($attendance) {
            $checkIn = $attendance->check_in_at->timezone('Asia/Jakarta');
            $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');
            
            $isIntern = $attendance->employee->user?->role === 'intern';
            $projectName = $isIntern 
                ? 'Bidang: ' . ($attendance->employee->division ?? '-') 
                : ($attendance->employee->activeProject()?->name ?? '-');

            return [
                'id' => $attendance->id,
                'name' => $attendance->employee->user->name ?? '-',
                'employeeId' => $attendance->employee->nik ?? '-',
                'avatar' => null,
                'avatarColor' => 'bg-emerald-500',
                'project' => $projectName,
                'clockIn' => $checkIn->format('H:i'),
                'clockInLate' => $checkIn->format('H:i') > '08:00',
                'clockOut' => $checkOut ? $checkOut->format('H:i') : '--:--',
                'status' => $checkOut ? 'Checked Out' : 'Checked In',
                'statusColor' => $checkOut ? 'text-[#035EA9] bg-blue-50' : 'text-emerald-600 bg-emerald-50',
                'mode' => $attendance->type,
                'modeBorder' => $attendance->type === 'WFO' ? 'border-[#035EA9] text-[#035EA9]' : 'border-[#00A099] text-[#00A099]',
                'notes' => $attendance->work_notes,
            ];
        });

        return Inertia::render('admin/dashboard', [
            'kpi' => [
                'totalPtt' => $totalPtt,
                'totalInterns' => $totalInterns,
                'checkedInToday' => $checkedInToday,
                'overtimeToday' => $overtimeToday,
            ],
            'attendanceTrendData' => $trendData,
            'workModeData' => $workModeData,
            'attendanceRecords' => $recentAttendances,
            'filters' => [
                'per_page' => $perPage,
            ],
        ]);
    }
}
