<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OvertimeController extends Controller
{
    /**
     * Tampilkan daftar riwayat lembur karyawan.
     * (FR-OVT-01)
     */
    public function index(): Response
    {
        // TODO: Pass user's overtime records
        return Inertia::render('employee/overtime/index');
    }

    /**
     * Tampilkan form input lembur manual.
     * (FR-OVT-01)
     */
    public function create(): Response
    {
        return Inertia::render('employee/overtime/create');
    }

    /**
     * Simpan entri lembur.
     * Field: tanggal, jam_mulai, jam_selesai, durasi, keterangan.
     */
    public function store(Request $request)
    {
        // TODO: Implement overtime store logic
        // 1. Validate: date, start_time, end_time, duration, description
        // 2. Auto-tag active project (FR-PROJ-02)
        // 3. Store overtime record

        return redirect()->route('employee.overtime.index');
    }
}
