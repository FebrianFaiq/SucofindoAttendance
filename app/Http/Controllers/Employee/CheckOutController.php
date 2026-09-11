<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\CheckOutRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class CheckOutController extends Controller
{
    /**
     * Tampilkan form Check Out.
     * (FR-ATT-02)
     */
    public function create(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee?->todayAttendance();

        return Inertia::render('employee/check-out', [
            'hasCheckedIn' => $todayAttendance !== null,
            'alreadyCheckedOut' => $todayAttendance?->check_out_at !== null,
            'todayAttendance' => $todayAttendance ? [
                'id' => $todayAttendance->id,
                'type' => $todayAttendance->type,
                'check_in_at' => $todayAttendance->check_in_at?->toIso8601String(),
                'check_out_at' => $todayAttendance->check_out_at?->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Proses Check Out.
     * Menyimpan catatan kerjaan harian, foto, dan lokasi GPS (wajib).
     */
    public function store(CheckOutRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee->todayAttendance();

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $year = date('Y');
            $targetDir = storage_path("app/public/attendance/check-out/{$year}");
            if (! is_dir($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $extension = $photo->getClientOriginalExtension() ?: 'jpg';
            $fileName = Str::uuid().'.'.$extension;
            $targetPath = $targetDir.'/'.$fileName;

            // Compress and resize image using Intervention Image
            $manager = new ImageManager(new Driver);
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

        return redirect()->route('employee.dashboard')
            ->with('success', 'Check-out berhasil dicatat.');
    }
}
