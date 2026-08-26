<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\OvertimeStoreRequest;
use App\Models\Overtime;
use App\Models\User;
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
        /** @var User $user */
        $user = Auth::user();

        if ($user->isIntern()) {
            abort(403, 'Mahasiswa magang tidak memiliki akses ke fitur lembur.');
        }

        $employee = $user->employee;

        $overtimes = Overtime::forEmployee($employee->id)
            ->with(['employee.projects'])
            ->orderByDesc('date')
            ->paginate(15);

        $statusMap = [
            'pending' => 'Belum Direview',
            'approved' => 'Sudah Direview',
            'rejected' => 'Canceled',
        ];

        $overtimes->getCollection()->transform(function ($overtime) use ($employee, $statusMap) {
            $durationHours = intval($overtime->duration);
            $durationMinutes = round(($overtime->duration - $durationHours) * 60);
            $durationFormatted = "{$durationHours} Jam {$durationMinutes} Menit";

            return [
                'id' => $overtime->id,
                'date' => \Carbon\Carbon::parse($overtime->date)->translatedFormat('d M Y'),
                'location' => 'Kantor', 
                'client' => $employee->activeProject()?->name ?? 'Internal',
                'duration' => $durationFormatted,
                'status' => $statusMap[$overtime->status] ?? 'Unknown',
            ];
        });

        $totalDurationMTD = Overtime::forEmployee($employee->id)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->where('status', 'approved')
            ->get()
            ->sum('duration');
        
        $totalHours = intval($totalDurationMTD);
        $totalMinutes = round(($totalDurationMTD - $totalHours) * 60);
        $totalDurationFormatted = "{$totalHours}h {$totalMinutes}m";

        $lastOvertime = Overtime::forEmployee($employee->id)->orderByDesc('created_at')->first();
        $lastStatus = $lastOvertime ? ($statusMap[$lastOvertime->status] ?? '-') : '-';

        return Inertia::render('employee/overtime/index', [
            'overtimes' => $overtimes,
            'totalDurationMtd' => $totalDurationFormatted,
            'lastStatus' => $lastStatus,
        ]);
    }

    /**
     * Tampilkan form input lembur manual.
     * (FR-OVT-01)
     */
    public function create(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->isIntern()) {
            abort(403, 'Mahasiswa magang tidak diizinkan mengajukan lembur.');
        }

        return Inertia::render('employee/overtime/create');
    }

    /**
     * Simpan entri lembur.
     * Field: tanggal, jam_mulai, jam_selesai, keterangan.
     * Auto-tag proyek aktif karyawan (FR-PROJ-02).
     */
    public function store(OvertimeStoreRequest $request): RedirectResponse
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
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        $romanMonth = $romanMonths[$date->month];
        
        $spklNumber = "{$sequence}/SBA-{$romanMonth}/LEMBUR/{$date->year}";

        Overtime::create([
            'employee_id' => $employee->id,
            'spkl_number' => $spklNumber,
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
