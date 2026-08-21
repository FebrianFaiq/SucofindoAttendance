<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\OvertimeStoreRequest;
use App\Models\Overtime;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Overtime API — Daftar & input lembur.
 *
 * Khusus role 'employee' (karyawan PTT).
 * Magang (intern) akan mendapat response 403.
 */
class OvertimeController extends Controller
{
    /**
     * Daftar riwayat lembur — GET /api/v1/overtime?page=1
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->isIntern()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mahasiswa magang tidak memiliki akses ke fitur lembur.',
            ], 403);
        }

        $employee = $user->employee;

        $overtimes = Overtime::forEmployee($employee->id)
            ->orderByDesc('date')
            ->paginate(15);

        $data = $overtimes->through(function ($overtime) {
            return [
                'id' => $overtime->id,
                'date' => $overtime->date instanceof \Illuminate\Support\Carbon
                    ? $overtime->date->format('Y-m-d')
                    : $overtime->date,
                'start_time' => $overtime->start_time,
                'end_time' => $overtime->end_time,
                'description' => $overtime->description,
                'status' => $overtime->status,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data->items(),
            'meta' => [
                'current_page' => $overtimes->currentPage(),
                'last_page' => $overtimes->lastPage(),
                'per_page' => $overtimes->perPage(),
                'total' => $overtimes->total(),
            ],
        ]);
    }

    /**
     * Submit lembur baru — POST /api/v1/overtime
     *
     * Validasi di-handle oleh OvertimeStoreRequest (sama dengan web).
     */
    public function store(OvertimeStoreRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $overtime = Overtime::create([
            'employee_id' => $employee->id,
            'date' => $request->validated('date'),
            'start_time' => $request->validated('start_time'),
            'end_time' => $request->validated('end_time'),
            'description' => $request->validated('description'),
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Entri lembur berhasil disimpan',
            'data' => [
                'overtime_id' => $overtime->id,
                'date' => $overtime->date instanceof \Illuminate\Support\Carbon
                    ? $overtime->date->format('Y-m-d')
                    : $overtime->date,
                'status' => $overtime->status,
            ],
        ], 201);
    }
}
