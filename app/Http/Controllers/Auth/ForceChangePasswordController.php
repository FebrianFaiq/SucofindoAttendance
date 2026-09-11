<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForceChangePasswordRequest;
use App\Models\PasswordChangeLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
    public function update(ForceChangePasswordRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // 1. Update password
        $user->update([
            'password' => Hash::make($request->validated('password')),
            'must_change_password' => false,
        ]);

        // 2. Catat ke audit log
        PasswordChangeLog::create([
            'user_id' => $user->id,
            'changed_by' => $user->id,
            'method' => 'self_change',
            'created_at' => now(),
        ]);

        // 3. Redirect ke dashboard sesuai role
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard')
                ->with('success', 'Password berhasil diubah.');
        }

        return redirect()->route('employee.dashboard')
            ->with('success', 'Password berhasil diubah.');
    }
}
