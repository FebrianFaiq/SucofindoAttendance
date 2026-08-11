<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard karyawan.
     * Ringkasan status kehadiran hari ini, proyek aktif, dll.
     */
    public function __invoke(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee?->todayAttendance();
        $activeProject = $employee?->activeProject();

        return Inertia::render('employee/dashboard', [
            'todayAttendance' => $todayAttendance,
            'activeProject' => $activeProject,
            'hasCheckedIn' => $todayAttendance !== null,
            'hasCheckedOut' => $todayAttendance?->check_out_at !== null,
        ]);
    }
}
