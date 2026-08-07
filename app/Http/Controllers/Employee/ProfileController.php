<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Tampilkan profil karyawan (read-only).
     * (FR-ATT-04)
     */
    public function show(Request $request): Response
    {
        // TODO: Pass user profile data
        // Include: nama, email, proyek yang sedang berjalan
        return Inertia::render('employee/profile');
    }
}
