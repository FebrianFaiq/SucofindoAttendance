<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmployeePasswordController extends Controller
{
    /**
     * Reset password karyawan.
     * (FR-AUTH-03)
     *
     * Menghasilkan password sementara baru dan menandai akun
     * agar wajib ganti password di login berikutnya.
     */
    public function reset(Request $request, string $employee)
    {
        // TODO: Implement password reset
        // 1. Generate temporary password
        // 2. Set must_change_password = true
        // 3. Return with success message + temporary password

        return redirect()->back();
    }
}
