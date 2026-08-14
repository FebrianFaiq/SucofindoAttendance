<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * Tampilkan monitoring kehadiran & master kalender hari libur.
     * (FR-ADM-02, FR-ADM-03)
     */
    public function index(Request $request): Response
    {
        $today = today();

        // 1. Query Kehadiran
        $query = Attendance::with([
            'employee.user',
            'employee.projects' => function ($q) {
                $q->wherePivot('status', 'active');
            },
        ]);

        // Filter date range
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $singleDate = $request->input('date');

        if ($startDate && $endDate) {
            $query->whereBetween('check_in_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        } elseif ($startDate) {
            $query->whereDate('check_in_at', '>=', $startDate);
        } elseif ($endDate) {
            $query->whereDate('check_in_at', '<=', $endDate);
        } elseif ($singleDate) {
            $query->whereDate('check_in_at', $singleDate);
        }

        // Filter tipe WFO / WFA
        if ($request->filled('type') && in_array($request->input('type'), ['WFO', 'WFA'])) {
            $query->where('type', $request->input('type'));
        }

        // Filter role (employee vs intern)
        if ($request->filled('role') && in_array($request->input('role'), ['employee', 'intern'])) {
            $query->whereHas('employee.user', function ($q) use ($request) {
                $q->where('role', $request->input('role'));
            });
        }

        // Search nama, NIK, atau nama Proyek / Bidang
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                    ->orWhere('division', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('projects', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = $request->query('per_page', 10);
        $attendances = $query->orderByDesc('check_in_at')
            ->paginate($perPage)
            ->withQueryString();

        // 2. Daftar Hari Libur (Seluruh tahun 2026)
        $holidays = Holiday::orderBy('date')->get()->map(function ($h) {
            return [
                'id' => $h->id,
                'date' => $h->date->format('Y-m-d'),
                'date_formatted' => $h->date->isoFormat('D MMMM Y'),
                'name' => $h->name,
                'is_national' => (bool) $h->is_national,
                'description' => $h->description,
            ];
        });

        // 3. Status Hari Ini (Kerja vs Libur/Weekend)
        $todayHoliday = Holiday::getHolidayDetails($today);
        $isTodayWeekend = $today->isWeekend();

        // 4. Quick Metrics
        $todayAttendancesCount = Attendance::whereDate('check_in_at', $today)->count();
        $todayClockInCount = Attendance::whereDate('check_in_at', $today)->whereNull('check_out_at')->count();
        $todayClockOutCount = Attendance::whereDate('check_in_at', $today)->whereNotNull('check_out_at')->count();
        $totalEmployees = User::whereIn('role', ['employee', 'intern'])->where('is_active', true)->count();

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'holidays' => $holidays,
            'todayInfo' => [
                'date' => $today->toDateString(),
                'date_formatted' => $today->isoFormat('dddd, D MMMM Y'),
                'is_holiday' => (bool) $todayHoliday,
                'holiday_name' => $todayHoliday?->name,
                'is_weekend' => $isTodayWeekend,
            ],
            'kpi' => [
                'presentToday' => $todayAttendancesCount,
                'clockInToday' => $todayClockInCount,
                'clockOutToday' => $todayClockOutCount,
                'totalEmployees' => $totalEmployees,
            ],
            'filters' => [
                'start_date' => $startDate ?? '',
                'end_date' => $endDate ?? '',
                'date' => $singleDate ?? '',
                'type' => $request->input('type', ''),
                'role' => $request->input('role', ''),
                'search' => $request->input('search', ''),
                'per_page' => $perPage,
            ],
        ]);
    }
}
