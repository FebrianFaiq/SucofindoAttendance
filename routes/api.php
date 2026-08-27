<?php

use App\Http\Controllers\Api\V1;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rute API untuk aplikasi mobile (Flutter).
| Semua rute di sini dimuat dengan prefix /api dan middleware 'api'.
| Kita menambahkan prefix /v1 untuk versioning.
|
*/

// ───────────────────────────────────────────
// Public Routes (tanpa token)
// ───────────────────────────────────────────
Route::prefix('v1')->group(function () {
    Route::post('auth/login', [V1\AuthController::class, 'login'])
        ->name('api.auth.login');
});

// ───────────────────────────────────────────
// Protected Routes (butuh Sanctum token)
// ───────────────────────────────────────────
Route::prefix('v1')
    ->middleware('auth:sanctum')
    ->group(function () {

        // Auth
        Route::post('auth/logout', [V1\AuthController::class, 'logout'])
            ->name('api.auth.logout');
        Route::post('auth/change-password', [V1\AuthController::class, 'changePassword'])
            ->name('api.auth.change_password');

        // Dashboard
        Route::get('dashboard', V1\DashboardController::class)
            ->name('api.dashboard');

        // Attendance
        Route::post('attendance/check-in', [V1\AttendanceController::class, 'checkIn'])
            ->name('api.attendance.checkin');
        Route::post('attendance/check-out', [V1\AttendanceController::class, 'checkOut'])
            ->name('api.attendance.checkout');
        Route::get('attendance/history', [V1\AttendanceController::class, 'history'])
            ->name('api.attendance.history');

        // Overtime
        Route::get('overtime', [V1\OvertimeController::class, 'index'])
            ->name('api.overtime.index');
        Route::post('overtime', [V1\OvertimeController::class, 'store'])
            ->name('api.overtime.store');

        // Profile
        Route::get('profile', [V1\ProfileController::class, 'show'])
            ->name('api.profile.show');
    });
