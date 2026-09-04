<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\OvertimeStoreRequest;
use App\Models\Holiday;
use App\Models\Overtime;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;

/**
 * Overtime API — Daftar & input lembur.
 *
 * Khusus role 'employee' (PTT Proyek).
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
                'message' => 'Magang tidak memiliki akses ke fitur lembur.',
            ], 403);
        }

        $employee = $user->employee;

        $overtimes = Overtime::forEmployee($employee->id)
            ->orderByDesc('date')
            ->paginate(15);

        $data = $overtimes->through(function ($overtime) {
            return [
                'id' => $overtime->id,
                'date' => $overtime->date instanceof Carbon
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

        $date = \Carbon\Carbon::parse($request->validated('date'));

        $count = Overtime::whereYear('date', $date->year)
            ->whereMonth('date', $date->month)
            ->count();

        $sequence = str_pad($count + 1, 4, '0', STR_PAD_LEFT);

        $romanMonths = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII',
        ];
        $romanMonth = $romanMonths[$date->month];

        $spklNumber = "{$sequence}/SBA-{$romanMonth}/LEMBUR/{$date->year}";

        $overtime = Overtime::create([
            'employee_id' => $employee->id,
            'spkl_number' => $spklNumber,
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
                'date' => $overtime->date instanceof Carbon
                    ? $overtime->date->format('Y-m-d')
                    : $overtime->date,
                'status' => $overtime->status,
            ],
        ], 201);
    }

    /**
     * Get daftar hari libur — GET /api/v1/overtime/holidays
     */
    public function holidays(Request $request): JsonResponse
    {
        $holidays = Holiday::select('date', 'name')
            ->whereYear('date', '>=', now()->year)
            ->get()
            ->map(fn ($h) => [
                'date' => $h->date->format('Y-m-d'),
                'name' => $h->name,
            ]);

        return response()->json([
            'status' => 'success',
            'data' => $holidays,
        ]);
    }

    public function exportPdfUrl(Overtime $overtime)
    {
        if ($overtime->employee->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $url = URL::signedRoute('export.spkl', ['overtime' => $overtime->id]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'url' => $url,
            ],
        ]);
    }
}
