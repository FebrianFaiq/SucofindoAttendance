<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\OvertimeStoreRequest;
use App\Models\Overtime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OvertimeController extends Controller
{
    /**
     * Tampilkan daftar riwayat lembur karyawan.
     * (FR-OVT-01)
     */
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $overtimes = Overtime::forEmployee($employee->id)
            ->orderByDesc('date')
            ->paginate(15);

        return Inertia::render('employee/overtime/index', [
            'overtimes' => $overtimes,
        ]);
    }

    /**
     * Tampilkan form input lembur manual.
     * (FR-OVT-01)
     */
    public function create(): Response
    {
        return Inertia::render('employee/overtime/create');
    }

    /**
     * Simpan entri lembur.
     * Field: tanggal, jam_mulai, jam_selesai, keterangan.
     * Auto-tag proyek aktif karyawan (FR-PROJ-02).
     */
    public function store(OvertimeStoreRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $employee = $user->employee;

        Overtime::create([
            'employee_id' => $employee->id,
            'date' => $request->validated('date'),
            'start_time' => $request->validated('start_time'),
            'end_time' => $request->validated('end_time'),
            'description' => $request->validated('description'),
            'status' => 'pending',
        ]);

        return redirect()->route('employee.overtime.index')
            ->with('success', 'Entri lembur berhasil disimpan.');
    }
}
