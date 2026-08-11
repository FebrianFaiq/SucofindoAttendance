<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * Tampilkan tabel kehadiran admin.
     * (FR-ADM-03)
     *
     * Kolom: Karyawan, Proyek, Jam Masuk, Jam Keluar,
     *        WFO/WFA, Catatan Kerja.
     * Filter: Tanggal, Karyawan (FR-ADM-02).
     */
    public function index(Request $request): Response
    {
        $query = Attendance::with(['employee.user', 'employee.projects' => function ($q) {
            $q->wherePivot('status', 'active');
        }]);

        // Filter tanggal (default: hari ini)
        if ($request->filled('date')) {
            $query->whereDate('check_in_at', $request->input('date'));
        } else {
            $query->today();
        }

        // Filter karyawan
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->input('employee_id'));
        }

        $attendances = $query->orderByDesc('check_in_at')->paginate(20);

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['date', 'employee_id']),
        ]);
    }
}
