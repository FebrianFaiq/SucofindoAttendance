<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
     * - Total Karyawan
     * - Hadir Hari Ini
     * - WFO Hari Ini
     * - WFA Hari Ini
     * - Belum Check In
     * - Belum Check Out
     * - Lembur Hari Ini
     */
    public function __invoke(Request $request): Response
    {
        // TODO: Calculate KPI metrics and pass attendance table data
        return Inertia::render('admin/dashboard');
    }
}
