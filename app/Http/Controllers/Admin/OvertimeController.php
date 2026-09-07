<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use App\Models\Overtime;
use App\Models\Project;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OvertimeController extends Controller
{
    /**
     * Tampilkan daftar monitoring lembur.
     * (FR-OVT-02, FR-OVT-03)
     *
     * Menampilkan seluruh entri lembur karyawan dan alert
     * saat melebihi ambang batas yang dikonfigurasi.
     */
    public function index(Request $request): Response
    {
        $query = Overtime::with(['employee.user', 'employee.projects', 'employee.salaries']);

        // Tentukan apakah ini request filter eksplisit dari user
        $isFiltered = $request->has('filtered');

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $statusInput = $request->input('status');
            if ($statusInput === 'canceled') {
                $statusInput = 'rejected';
            }
            $query->where('status', $statusInput);
        }

        // Filter tanggal: default bulan berjalan, atau sesuai filter user
        if (!$isFiltered) {
            // Default: tampilkan hanya data bulan ini
            $query->whereMonth('date', now()->month)
                  ->whereYear('date', now()->year);
        } else {
            // Filter eksplisit dari user
            if ($request->filled('date_from')) {
                $query->where('date', '>=', $request->input('date_from'));
            }
            if ($request->filled('date_to')) {
                $query->where('date', '<=', $request->input('date_to'));
            }
        }

        // Filter nama/nik karyawan (server-side)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter proyek (server-side)
        if ($request->filled('project_filter')) {
            $projectName = $request->input('project_filter');
            $query->whereHas('employee.projects', function ($q) use ($projectName) {
                $q->where('name', $projectName);
            });
        }

        $overtimes = $query->orderByDesc('date')->paginate(50);

        // Format data untuk disesuaikan dengan FE
        $overtimes->getCollection()->transform(function ($overtime) {
            $employee = $overtime->employee;
            $user = $employee->user;
            $project = $employee->activeProject();
            $salary = $employee->activeSalary();

            $description = $overtime->description ?? '';
            $locationClient = '-';
            if (preg_match('/^\[Lokasi: (.*?) \| Klien: (.*?) \| No Order: (.*?)\]\n?(.*)$/s', $description, $matches)) {
                $locationClient = $matches[1].' / '.$matches[2];
                $description = trim($matches[4]);
            } elseif (preg_match('/^\[Lokasi: (.*?) \| Klien: (.*?)\]\n?(.*)$/s', $description, $matches)) {
                $locationClient = $matches[1].' / '.$matches[2];
                $description = trim($matches[3]);
            }

            return [
                'id' => $overtime->id,
                'spkl_no' => $overtime->spkl_number ?? '-',
                'employee' => [
                    'nik' => $employee->nik,
                    'name' => $user->name,
                    'role' => $user->role,
                    'division' => $employee->division,
                    'project' => $project?->name,
                ],
                'project' => $project?->name,
                'location_client' => $locationClient,
                'date' => $overtime->date->format('Y-m-d'),
                'start_time' => Carbon::parse($overtime->start_time)->format('H:i'),
                'end_time' => Carbon::parse($overtime->end_time)->format('H:i'),
                'duration_hours' => $overtime->duration,
                'status' => $overtime->status === 'rejected' ? 'canceled' : $overtime->status,
                'work_notes' => $description,
                'gaji_pokok' => $salary?->base_salary ?? 0,
                'is_holiday' => $overtime->date->isWeekend() || Holiday::isHoliday($overtime->date),
            ];
        });

        // Ambil threshold dari settings
        $thresholdHours = Setting::getValue('overtime_threshold_hours', 3);
        $projects = Project::orderBy('name')->get();

        // KPI: scope sama dengan data yang ditampilkan
        $totalQuery = Overtime::query();
        if (!$isFiltered) {
            $totalQuery->whereMonth('date', now()->month)
                       ->whereYear('date', now()->year);
        } else {
            if ($request->filled('date_from')) {
                $totalQuery->where('date', '>=', $request->input('date_from'));
            }
            if ($request->filled('date_to')) {
                $totalQuery->where('date', '<=', $request->input('date_to'));
            }
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $totalQuery->whereHas('employee', function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('project_filter')) {
            $projectName = $request->input('project_filter');
            $totalQuery->whereHas('employee.projects', function ($q) use ($projectName) {
                $q->where('name', $projectName);
            });
        }

        $kpi = [
            'pending' => (clone $totalQuery)->where('status', 'pending')->count(),
            'approved' => (clone $totalQuery)->where('status', 'approved')->count(),
            'canceled' => (clone $totalQuery)->where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/overtime/index', [
            'overtimes' => $overtimes,
            'projects' => $projects,
            'kpi' => $kpi,
            'thresholdHours' => (float) $thresholdHours,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'project_filter', 'search', 'filtered']),
            'isFiltered' => $isFiltered,
        ]);
    }

    /**
     * Setujui lembur.
     */
    public function approve(Overtime $overtime)
    {
        $overtime->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Lembur berhasil disetujui.');
    }

    /**
     * Tolak/Cancel lembur.
     */
    public function reject(Overtime $overtime)
    {
        $overtime->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Lembur berhasil ditolak.');
    }
}
