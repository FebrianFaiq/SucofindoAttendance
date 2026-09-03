<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\CheckInRequest;
use App\Http\Requests\Employee\CheckOutRequest;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

/**
 * Attendance API — Check-in, Check-out, History.
 *
 * Re-uses FormRequest dari web (CheckInRequest, CheckOutRequest) untuk validasi.
 * Logika bisnis identik dengan Employee\CheckInController & CheckOutController.
 */
class AttendanceController extends Controller
{
    /**
     * Check-in — POST /api/v1/attendance/check-in
     *
     * Menerima multipart/form-data (photo, type, gps_lat, gps_lng).
     * Validasi di-handle oleh CheckInRequest (sama dengan web).
     */
    public function checkIn(CheckInRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        // Simpan foto bukti check-in (sama dengan web: gunakan move() untuk PHP 8.4 compat)
        $photo = $request->file('photo');
        if (! $photo || ! $photo->isValid()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Foto gagal diunggah. Silakan coba lagi.',
                'errors' => ['photo' => ['Foto gagal diunggah. Silakan coba lagi.']],
            ], 422);
        }

        $year = date('Y');
        $targetDir = storage_path("app/public/attendance/check-in/{$year}");
        if (! is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $extension = $photo->getClientOriginalExtension() ?: 'jpg';
        $fileName = Str::uuid().'.'.$extension;
        $targetPath = $targetDir.'/'.$fileName;

        // Compress and resize image using Intervention Image
        $manager = new ImageManager(new Driver());
        $image = $manager->decode($photo->getRealPath());
        $image->scaleDown(width: 800);
        $image->save($targetPath, 75);

        $photoPath = "attendance/check-in/{$year}/{$fileName}";

        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'type' => $request->validated('type'),
            'check_in_at' => now(),
            'check_in_evidence' => $photoPath,
            'check_in_latitude' => $request->validated('gps_lat'),
            'check_in_longitude' => $request->validated('gps_lng'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Check-in berhasil dicatat',
            'data' => [
                'attendance_id' => $attendance->id,
                'check_in_at' => $attendance->check_in_at->timezone('Asia/Jakarta')->toIso8601String(),
                'type' => $attendance->type,
            ],
        ], 201);
    }

    /**
     * Check-out — POST /api/v1/attendance/check-out
     *
     * Menerima multipart/form-data { work_notes, photo, gps_lat, gps_lng }.
     * Validasi di-handle oleh CheckOutRequest (sama dengan web).
     */
    public function checkOut(CheckOutRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee->todayAttendance();

        // Simpan foto bukti check-out
        $photoPath = null;
        $photo = $request->file('photo');
        if ($photo && $photo->isValid()) {
            $year = date('Y');
            $targetDir = storage_path("app/public/attendance/check-out/{$year}");
            if (! is_dir($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $extension = $photo->getClientOriginalExtension() ?: 'jpg';
            $fileName = Str::uuid().'.'.$extension;
            $targetPath = $targetDir.'/'.$fileName;

            // Compress and resize image using Intervention Image
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($photo->getRealPath());
            $image->scaleDown(width: 800);
            $image->save($targetPath, 75);

            $photoPath = "attendance/check-out/{$year}/{$fileName}";
        }

        $todayAttendance->update([
            'check_out_at' => now(),
            'work_notes' => $request->validated('work_notes'),
            'check_out_evidence' => $photoPath,
            'check_out_latitude' => $request->validated('gps_lat'),
            'check_out_longitude' => $request->validated('gps_lng'),
        ]);

        // Hitung durasi
        $checkIn = $todayAttendance->check_in_at;
        $checkOut = $todayAttendance->fresh()->check_out_at;
        $duration = null;
        if ($checkIn && $checkOut) {
            $diff = $checkIn->diff($checkOut);
            $duration = $diff->h.'j '.$diff->i.'m';
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Check-out berhasil dicatat',
            'data' => [
                'attendance_id' => $todayAttendance->id,
                'check_out_at' => $checkOut->timezone('Asia/Jakarta')->toIso8601String(),
                'duration' => $duration,
            ],
        ]);
    }

    /**
     * History — GET /api/v1/attendance/history?page=1
     *
     * Menampilkan riwayat kehadiran 1 bulan terakhir (paginated).
     */
    public function history(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        if (! $employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profil karyawan tidak ditemukan.',
            ], 404);
        }

        $attendances = Attendance::forEmployee($employee->id)
            ->where('check_in_at', '>=', now()->subMonth())
            ->orderByDesc('check_in_at')
            ->paginate(15);

        $isIntern = $user->role === 'intern';

        $data = $attendances->through(function ($attendance) use ($employee, $isIntern) {
            $checkIn = $attendance->check_in_at?->timezone('Asia/Jakarta');
            $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');

            $projectName = $isIntern
                ? 'Bidang: '.($employee->division ?? '-')
                : ($employee->activeProject()?->name ?? '-');

            return [
                'id' => $attendance->id,
                'date' => $checkIn?->translatedFormat('d M Y') ?? '-',
                'clock_in' => $checkIn?->format('H:i'),
                'clock_out' => $checkOut?->format('H:i'),
                'type' => strtoupper($attendance->type ?? 'WFO'),
                'project_name' => $projectName,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data->items(),
            'meta' => [
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
                'per_page' => $attendances->perPage(),
                'total' => $attendances->total(),
            ],
        ]);
    }
}
