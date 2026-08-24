<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\User;
use App\Models\Project;
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
            $query->whereBetween('check_in_at', [$startDate.' 00:00:00', $endDate.' 23:59:59']);
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

        // Search nama, NIK
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                    ->orWhere('division', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter project
        if ($request->filled('project_id')) {
            $projectId = $request->input('project_id');
            $query->whereHas('employee.projects', function ($q) use ($projectId) {
                $q->where('projects.id', $projectId)->where('employee_projects.status', 'active');
            });
        }

        $perPage = $request->query('per_page', 10);
        $attendances = $query->orderByDesc('check_in_at')
            ->paginate($perPage)
            ->withQueryString();

        // Transform attendance data to include WIB-formatted times and evidence URL
        $attendances->getCollection()->transform(function ($attendance) {
            $checkIn = $attendance->check_in_at?->timezone('Asia/Jakarta');
            $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');

            $attendance->check_in_at_formatted = $checkIn?->format('H:i');
            $attendance->check_out_at_formatted = $checkOut?->format('H:i');
            $attendance->check_in_at_iso = $checkIn?->toIso8601String();
            $attendance->check_out_at_iso = $checkOut?->toIso8601String();
            $attendance->check_in_evidence_url = $attendance->check_in_evidence
                ? '/storage/'.$attendance->check_in_evidence
                : null;
            $attendance->check_out_evidence_url = $attendance->check_out_evidence
                ? '/storage/'.$attendance->check_out_evidence
                : null;

            return $attendance;
        });

        // 3. Status Hari Ini (Kerja vs Libur/Weekend)
        $todayHoliday = Holiday::getHolidayDetails($today);
        $isTodayWeekend = $today->isWeekend();

        // 4. Quick Metrics
        $todayAttendancesCount = Attendance::whereDate('check_in_at', $today)->count();
        $todayClockInCount = Attendance::whereDate('check_in_at', $today)->whereNull('check_out_at')->count();
        $todayClockOutCount = Attendance::whereDate('check_in_at', $today)->whereNotNull('check_out_at')->count();
        $totalEmployees = User::whereIn('role', ['employee', 'intern'])->where('is_active', true)->count();

        // 5. Daftar Proyek
        $projects = Project::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'projects' => $projects,
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
                'project_id' => $request->input('project_id', ''),
                'per_page' => $perPage,
            ],
        ]);
    }
}
