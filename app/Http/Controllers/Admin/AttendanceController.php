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

        // Filter date range
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('check_in_at', [$request->input('start_date') . ' 00:00:00', $request->input('end_date') . ' 23:59:59']);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('check_in_at', '>=', $request->input('start_date'));
        } elseif ($request->filled('end_date')) {
            $query->whereDate('check_in_at', '<=', $request->input('end_date'));
        } else {
            // default to today? Or show all? The design says "Riwayat Aktivitas Kehadiran Hari ini"
            $query->today();
        }

        // Filter search (karyawan / proyek)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('employee.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('employee_code', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            })->orWhereHas('employee.projects', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->wherePivot('status', 'active');
            });
        }

        $attendances = $query->orderByDesc('check_in_at')->paginate(10);

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['start_date', 'end_date', 'search']),
        ]);
    }
}
