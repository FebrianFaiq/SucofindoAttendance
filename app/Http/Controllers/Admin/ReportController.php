<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Tampilkan halaman rekap kehadiran.
     * (FR-EXP-01)
     *
     * Rekap bulanan dengan filter: Karyawan, Proyek, Tanggal.
     */
    public function index(Request $request): Response
    {
        // TODO: Pass report data with filters
        return Inertia::render('admin/reports/index');
    }

    /**
     * Export rekap kehadiran.
     * (FR-EXP-01)
     *
     * Format: CSV atau Excel.
     * Filter: Karyawan, Proyek, Tanggal (rentang).
     */
    public function export(Request $request)
    {
        // TODO: Implement export logic
        // 1. Validate: format (csv/excel), filters
        // 2. Generate file
        // 3. Return download response

        return redirect()->back();
    }
}
