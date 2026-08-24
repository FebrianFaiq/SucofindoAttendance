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

        // Filter status
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
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
                'location_client' => '-',
                'date' => $overtime->date->format('Y-m-d'),
                'start_time' => \Carbon\Carbon::parse($overtime->start_time)->format('H:i'),
                'end_time' => \Carbon\Carbon::parse($overtime->end_time)->format('H:i'),
                'duration_hours' => $overtime->duration,
                'status' => $overtime->status,
                'work_notes' => $overtime->description,
                'gaji_pokok' => $salary?->base_salary ?? 0,
            ];
        });

        // Ambil threshold dari settings
        $thresholdHours = Setting::getValue('overtime_threshold_hours', 3);
        $projects = \App\Models\Project::orderBy('name')->get();

        return Inertia::render('admin/overtime/index', [
            'overtimes' => $overtimes,
            'projects' => $projects,
            'thresholdHours' => (float) $thresholdHours,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'project_filter']),
        ]);
    }
}
