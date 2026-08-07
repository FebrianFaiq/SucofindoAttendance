<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ForceChangePasswordController extends Controller
{
    /**
     * Tampilkan halaman wajib ganti password.
     * (FR-AUTH-02)
     */
    public function show(): Response
    {
        return Inertia::render('auth/force-change-password');
    }

    /**
     * Proses ganti password.
     * Setelah berhasil, redirect ke dashboard sesuai role.
     */
    public function update(Request $request)
    {
        // TODO: Implement password update logic
        // 1. Validate new password
        // 2. Update user password
        // 3. Set must_change_password = false
        // 4. Redirect to appropriate dashboard

        $user = $request->user();

        if ($user && $user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('employee.dashboard');
    }
}
