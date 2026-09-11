<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Tampilkan profil karyawan (read-only).
     * (FR-ATT-04)
     *
     * Include: nama, email, kode karyawan, NIK, telepon, proyek aktif.
     */
    public function show(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;
        $activeProject = $employee?->activeProject();
        $activeSalary = $employee?->activeSalary();

        return Inertia::render('employee/profile', [
            'employee' => $employee,
            'activeProject' => $activeProject,
            'activeSalary' => $activeSalary,
        ]);
    }
}
