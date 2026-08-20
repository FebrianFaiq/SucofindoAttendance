<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Profile API — Lihat profil karyawan (read-only).
 */
class ProfileController extends Controller
{
    /**
     * GET /api/v1/profile
     */
    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;
        $activeProject = $employee?->activeProject();

        $isIntern = $user->role === 'intern';

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'employee' => $employee ? [
                    'nik' => $employee->nik,
                    'division' => $employee->division,
                    'phone' => $employee->phone,
                ] : null,
                'active_project' => $activeProject && ! $isIntern ? [
                    'id' => $activeProject->id,
                    'name' => $activeProject->name,
                    'code' => $activeProject->code ?? null,
                ] : null,
                // Untuk magang, tampilkan bidang alih-alih proyek
                'bidang' => $isIntern ? ($employee?->division ?? '-') : null,
            ],
        ]);
    }
}
