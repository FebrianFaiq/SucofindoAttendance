<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\CheckInRequest;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class CheckInController extends Controller
{
    /**
     * Tampilkan form Check In.
     * (FR-ATT-01)
     */
    public function create(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $todayAttendance = $employee?->todayAttendance();

        return Inertia::render('employee/check-in', [
            'alreadyCheckedIn' => $todayAttendance !== null,
            'todayAttendance' => $todayAttendance,
        ]);
    }

    /**
     * Proses Check In.
     * Menyimpan foto, GPS, status WFO/WFA, dan auto-tag proyek aktif.
     */
    public function store(CheckInRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $employee = $user->employee;

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $year = date('Y');
            $targetDir = storage_path("app/public/attendance/check-in/{$year}");
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

            $photoPath = "attendance/check-in/{$year}/{$fileName}";
        }

        Attendance::create([
            'employee_id' => $employee->id,
            'type' => $request->validated('type'),
            'check_in_at' => now(),
            'check_in_evidence' => $photoPath,
            'check_in_latitude' => $request->validated('gps_lat'),
            'check_in_longitude' => $request->validated('gps_lng'),
        ]);

        return redirect()->route('employee.dashboard')
            ->with('success', 'Check-in berhasil dicatat.');
    }
}
