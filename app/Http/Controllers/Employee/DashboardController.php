<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard karyawan.
     * Ringkasan status kehadiran hari ini.
     */
    public function __invoke(Request $request): Response
    {
        // TODO: Pass attendance status, active project, etc.
        return Inertia::render('employee/dashboard');
    }
}
