<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
     *        Status Kehadiran (flag), WFO/WFA, Lembur.
     * Filter: Tanggal, Karyawan, Proyek (FR-ADM-02).
     */
    public function index(Request $request): Response
    {
        // TODO: Pass filtered attendance data with flags
        return Inertia::render('admin/attendance/index');
    }
}
