<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Tampilkan halaman rekap kehadiran.
     * (FR-EXP-01)
     *
     * Rekap bulanan dengan filter: Karyawan, Tanggal.
     */
    public function index(Request $request): Response
    {
        $query = Attendance::with(['employee.user']);

        // Filter rentang tanggal
        if ($request->filled('date_from')) {
            $query->whereDate('check_in_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('check_in_at', '<=', $request->input('date_to'));
        }

        // Filter karyawan
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->input('employee_id'));
        }

        $attendances = $query->orderByDesc('check_in_at')->paginate(20);

        return Inertia::render('admin/reports/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['date_from', 'date_to', 'employee_id']),
        ]);
    }

    /**
     * Export rekap kehadiran ke CSV.
     * (FR-EXP-01)
     */
    public function export(Request $request): HttpResponse
    {
        $query = Attendance::with(['employee.user']);

        // Terapkan filter yang sama dengan index
        if ($request->filled('date_from')) {
            $query->whereDate('check_in_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('check_in_at', '<=', $request->input('date_to'));
        }
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->input('employee_id'));
        }

        $attendances = $query->orderByDesc('check_in_at')->get();

        // Generate CSV
        $csvHeader = ['Nama', 'Kode Karyawan', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Tipe', 'Catatan Kerja'];
        $csvRows = $attendances->map(function ($attendance) {
            return [
                $attendance->employee->user->name ?? '-',
                $attendance->employee->employee_code ?? '-',
                $attendance->check_in_at?->format('Y-m-d') ?? '-',
                $attendance->check_in_at?->format('H:i') ?? '-',
                $attendance->check_out_at?->format('H:i') ?? '-',
                $attendance->type,
                str_replace(["\r", "\n"], ' ', $attendance->work_notes ?? '-'),
            ];
        });

        $output = implode(',', $csvHeader) . "\n";
        foreach ($csvRows as $row) {
            $output .= implode(',', array_map(fn ($val) => '"' . str_replace('"', '""', $val) . '"', $row)) . "\n";
        }

        $filename = 'rekap-kehadiran-' . now()->format('Y-m-d') . '.csv';

        return response($output, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
