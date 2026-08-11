<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PasswordChangeLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeePasswordController extends Controller
{
    /**
     * Default password untuk reset.
     */
    private const DEFAULT_PASSWORD = 'sucofindo123';

    /**
     * Reset password karyawan ke password default.
     * (FR-AUTH-03)
     *
     * Password di-reset ke default dan akun ditandai
     * agar wajib ganti password di login berikutnya.
     */
    public function reset(Request $request, Employee $employee): RedirectResponse
    {
        DB::transaction(function () use ($employee) {
            $user = $employee->user;

            // 1. Reset password ke default
            $user->update([
                'password' => Hash::make(self::DEFAULT_PASSWORD),
                'must_change_password' => true,
            ]);

            // 2. Catat ke audit log
            PasswordChangeLog::create([
                'user_id' => $user->id,
                'changed_by' => Auth::id(),
                'method' => 'reset',
                'created_at' => now(),
            ]);
        });

        return redirect()->back()
            ->with('success', 'Password karyawan berhasil di-reset. Password default: ' . self::DEFAULT_PASSWORD);
    }
}
