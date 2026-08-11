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
        $totalEmployees = Employee::whereHas('user', fn ($q) => $q->where('is_active', true))->count();
        $todayAttendances = Attendance::today()->get();

        $checkedInToday = $todayAttendances->count();
        $wfoToday = $todayAttendances->where('type', 'WFO')->count();
        $wfaToday = $todayAttendances->where('type', 'WFA')->count();
        $notCheckedIn = $totalEmployees - $checkedInToday;
        $notCheckedOut = $todayAttendances->whereNull('check_out_at')->count();
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

        // Riwayat Kehadiran (Recent)
        $recentAttendances = Attendance::with(['employee.user', 'employee.projects' => function ($q) {
            $q->wherePivot('status', 'active');
        }])->today()->latest('check_in_at')->limit(10)->get()->map(function ($attendance) {
            return [
                'id' => $attendance->id,
                'name' => $attendance->employee->user->name ?? '-',
                'employeeId' => $attendance->employee->employee_code ?? '-',
                'avatar' => null,
                'avatarColor' => 'bg-emerald-500', // We can improve this logic later if needed
                'project' => $attendance->employee->activeProject()?->name ?? '-',
                'clockIn' => $attendance->check_in_at->format('H:i'),
                'clockInLate' => $attendance->check_in_at->format('H:i') > '08:00', // Simplified logic
                'clockOut' => $attendance->check_out_at ? $attendance->check_out_at->format('H:i') : '--:--',
                'status' => $attendance->check_out_at ? 'Checked Out' : 'Checked In',
                'statusColor' => $attendance->check_out_at ? 'text-[#035EA9] bg-blue-50' : 'text-emerald-600 bg-emerald-50',
                'mode' => $attendance->type,
                'modeBorder' => $attendance->type === 'WFO' ? 'border-[#035EA9] text-[#035EA9]' : 'border-[#00A099] text-[#00A099]',
                'notes' => $attendance->work_notes,
            ];
        });

        return Inertia::render('admin/dashboard', [
            'kpi' => [
                'totalEmployees' => $totalEmployees,
                'checkedInToday' => $checkedInToday,
                'wfoToday' => $wfoToday,
                'wfaToday' => $wfaToday,
                'notCheckedIn' => $notCheckedIn,
                'notCheckedOut' => $notCheckedOut,
                'overtimeToday' => $overtimeToday,
            ],
            'attendanceTrendData' => $trendData,
            'workModeData' => $workModeData,
            'attendanceRecords' => $recentAttendances,
        ]);
    }
}
