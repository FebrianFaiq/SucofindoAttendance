<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Overtime;
use App\Models\Setting;
use Illuminate\Http\Request;
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

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $statusInput = $request->input('status');
            if ($statusInput === 'canceled') $statusInput = 'rejected';
            $query->where('status', $statusInput);
        }

        // Filter tanggal
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->input('date_to'));
        }

        $overtimes = $query->orderByDesc('date')->paginate(20);

        // Format data untuk disesuaikan dengan FE
        $overtimes->getCollection()->transform(function ($overtime) {
            $employee = $overtime->employee;
            $user = $employee->user;
            $project = $employee->activeProject();
            $salary = $employee->activeSalary();

                $description = $overtime->description ?? '';
                $locationClient = '-';
                if (preg_match('/^\[Lokasi: (.*?) \| Klien: (.*?)\]\n?(.*)$/s', $description, $matches)) {
                    $locationClient = $matches[1] . ' / ' . $matches[2];
                    $description = $matches[3];
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
                    'start_time' => \Carbon\Carbon::parse($overtime->start_time)->format('H:i'),
                    'end_time' => \Carbon\Carbon::parse($overtime->end_time)->format('H:i'),
                    'duration_hours' => $overtime->duration,
                    'status' => $overtime->status === 'rejected' ? 'canceled' : $overtime->status,
                    'work_notes' => $description,
                    'gaji_pokok' => $salary?->base_salary ?? 0,
                    'is_holiday' => $overtime->date->isWeekend() || \App\Models\Holiday::isHoliday($overtime->date),
            ];
        });

        $kpiQuery = clone $query;
        // Hapus filter pagination & batasan limit
        $kpiQuery->getQuery()->orders = []; // Hilangkan order untuk count

        // Ambil threshold dari settings
        $thresholdHours = Setting::getValue('overtime_threshold_hours', 3);
        $projects = \App\Models\Project::orderBy('name')->get();

        // Total count tanpa pagination, tapi dengan filter date & project
        // Note: $query sudah difilter status. Jika kita ingin melihat TOTAL (semua status),
        // kita perlu query ulang hanya dengan filter tanggal & project.
        $totalQuery = Overtime::query();
        if ($request->filled('date_from')) $totalQuery->where('date', '>=', $request->input('date_from'));
        if ($request->filled('date_to')) $totalQuery->where('date', '<=', $request->input('date_to'));
        
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
            'filters' => $request->only(['status', 'date_from', 'date_to', 'project_filter']),
        ]);
    }

    /**
     * Setujui lembur.
     */
    public function approve(Overtime $overtime)
    {
        $overtime->update([
            'status' => 'approved',
            'approved_by' => \Illuminate\Support\Facades\Auth::id(),
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
            'approved_by' => \Illuminate\Support\Facades\Auth::id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Lembur berhasil ditolak.');
    }
}
