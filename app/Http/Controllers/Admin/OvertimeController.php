<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        // TODO: Pass overtime data with threshold alerts
        return Inertia::render('admin/overtime/index');
    }
}
