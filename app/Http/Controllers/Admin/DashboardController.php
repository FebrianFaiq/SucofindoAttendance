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
        ]);
    }
}
