<?php

use App\Http\Controllers\Auth\ForceChangePasswordController;
use App\Http\Controllers\Employee;
use App\Http\Controllers\Admin;
use App\Http\Middleware\EnsurePasswordChanged;
use App\Http\Middleware\EnsureRole;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Attendance System Routes
|--------------------------------------------------------------------------
|
| Routes untuk Sistem Absensi SUCOFINDO.
| Dibagi menjadi 3 grup:
| 1. Force Change Password (auth, tanpa password.changed)
| 2. Employee Routes (auth + password.changed)
| 3. Admin Routes (auth + password.changed + role:admin)
|
*/

// ─── Force Change Password ──────────────────────────────────────────────────
// Route ini harus bisa diakses oleh user yang belum ganti password,
// jadi TIDAK menggunakan middleware EnsurePasswordChanged.
// [Bypass Testing]: middleware(['auth']) dikomentari sementara
// Route::middleware(['auth'])->group(function () {
    Route::get('force-change-password', [ForceChangePasswordController::class, 'show'])
        ->name('force-change-password');
    Route::post('force-change-password', [ForceChangePasswordController::class, 'update'])
        ->name('force-change-password.update');
// });

// ─── Employee Routes ────────────────────────────────────────────────────────
Route::prefix('employee')
    // Kode asli (Autentikasi Aktif):
    // ->middleware(['auth', EnsurePasswordChanged::class])
    // [Bypass Testing]: middleware di-bypass sementara
    ->group(function () {
        // Dashboard
        Route::get('dashboard', Employee\DashboardController::class)
            ->name('employee.dashboard');

        // Check In
        Route::get('check-in', [Employee\CheckInController::class, 'create'])
            ->name('employee.checkin.create');
        Route::post('check-in', [Employee\CheckInController::class, 'store'])
            ->name('employee.checkin.store');

        // Check Out
        Route::get('check-out', [Employee\CheckOutController::class, 'create'])
            ->name('employee.checkout.create');
        Route::post('check-out', [Employee\CheckOutController::class, 'store'])
            ->name('employee.checkout.store');

        // Lembur (Overtime)
        Route::get('overtime', [Employee\OvertimeController::class, 'index'])
            ->name('employee.overtime.index');
        Route::get('overtime/create', [Employee\OvertimeController::class, 'create'])
            ->name('employee.overtime.create');
        Route::post('overtime', [Employee\OvertimeController::class, 'store'])
            ->name('employee.overtime.store');

        // Riwayat Kehadiran (History)
        Route::get('history', [Employee\HistoryController::class, 'index'])
            ->name('employee.history.index');

        // Profil
        Route::get('profile', [Employee\ProfileController::class, 'show'])
            ->name('employee.profile.show');
    });

// ─── Admin Routes ───────────────────────────────────────────────────────────
Route::prefix('admin')
    // Kode asli (Autentikasi & Role Admin Aktif):
    // ->middleware(['auth', EnsurePasswordChanged::class, EnsureRole::class.':admin'])
    // [Bypass Testing]: middleware di-bypass sementara
    ->group(function () {
        // Dashboard
        Route::get('dashboard', Admin\DashboardController::class)
            ->name('admin.dashboard');

        // Manajemen Karyawan (Employee Management)
        Route::resource('employees', Admin\EmployeeController::class)
            ->names('admin.employees');

        // Reset Password Karyawan
        Route::post('employees/{employee}/reset-password', [Admin\EmployeePasswordController::class, 'reset'])
            ->name('admin.employees.reset-password');

        // Manajemen Proyek (Project Management)
        Route::resource('projects', Admin\ProjectController::class)
            ->names('admin.projects')
            ->except(['show']);

        // Penugasan Proyek (Project Assignment)
        Route::post('assignments', [Admin\AssignmentController::class, 'store'])
            ->name('admin.assignments.store');
        Route::put('assignments/{assignment}', [Admin\AssignmentController::class, 'update'])
            ->name('admin.assignments.update');
        Route::delete('assignments/{assignment}', [Admin\AssignmentController::class, 'destroy'])
            ->name('admin.assignments.destroy');

        // Tabel Kehadiran (Attendance Table)
        Route::get('attendance', [Admin\AttendanceController::class, 'index'])
            ->name('admin.attendance.index');

        // Monitoring Lembur (Overtime Monitoring)
        Route::get('overtime', [Admin\OvertimeController::class, 'index'])
            ->name('admin.overtime.index');

        // Rekap & Export (Reports & Export)
        Route::get('reports', [Admin\ReportController::class, 'index'])
            ->name('admin.reports.index');
        Route::get('reports/export', [Admin\ReportController::class, 'export'])
            ->name('admin.reports.export');
    });
