<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Tampilkan riwayat kehadiran karyawan.
     * (FR-ATT-03)
     */
    public function index(): Response
    {
        // TODO: Pass user's attendance history
        // Include: tanggal, jam masuk/keluar, proyek, WFO/WFA, catatan kerjaan
        return Inertia::render('employee/history');
    }
}
