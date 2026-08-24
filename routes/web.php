<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Auth\ForceChangePasswordController;
use App\Http\Controllers\Employee;
use App\Http\Controllers\Web\AuthController;
use App\Http\Middleware\EnsurePasswordChanged;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Rute untuk Web Admin dan Web User (Employee).
| Semua rute di sini dimuat oleh RouteServiceProvider dan masuk
| ke grup middleware "web" (session, CSRF, dll).
|
*/

// Redirect root ke login (atau dashboard jika sudah login, ditangani AuthController/Middleware)
Route::redirect('/', '/login');

// ───────────────────────────────────────────
// Guest Routes (belum login)
// ───────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'create'])->name('login');
    Route::post('login', [AuthController::class, 'store']);
});

// ───────────────────────────────────────────
// Authenticated Routes (Umum)
// ───────────────────────────────────────────
Route::middleware(['auth'])->group(function () {
    Route::post('logout', [AuthController::class, 'destroy'])->name('logout');

    // ─── Force Change Password ──────────────────────────────────────────────
    Route::get('force-change-password', [ForceChangePasswordController::class, 'show'])
        ->name('force-change-password');
    Route::post('force-change-password', [ForceChangePasswordController::class, 'update'])
        ->name('force-change-password.update');
});

// ───────────────────────────────────────────
// Employee Routes (Web User)
// ───────────────────────────────────────────
Route::prefix('employee')
    ->middleware(['auth', EnsurePasswordChanged::class])
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

// ───────────────────────────────────────────
// Admin Routes (Web Admin)
// ───────────────────────────────────────────
Route::prefix('admin')
    ->middleware(['auth', EnsurePasswordChanged::class, 'role:admin'])
    ->group(function () {
        // Dashboard
        Route::get('dashboard', Admin\DashboardController::class)
            ->name('admin.dashboard');
        Route::get('dashboard/stream', Admin\DashboardStreamController::class)
            ->name('admin.dashboard.stream');

        // Manajemen Karyawan (Employee Management)
        Route::resource('employees', Admin\EmployeeController::class)
            ->names('admin.employees');

        // Reset Password Karyawan
        Route::post('employees/{employee}/reset-password', [Admin\EmployeePasswordController::class, 'reset'])
            ->name('admin.employees.reset-password');

        // Manajemen Proyek (Project Management)
        Route::resource('projects', Admin\ProjectController::class)
            ->names('admin.projects');

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
        Route::get('reports/export-excel', [Admin\ReportController::class, 'exportExcel'])
            ->name('admin.reports.export-excel');
        Route::get('reports/overtime-export-excel', [Admin\ReportController::class, 'exportOvertimeExcel'])
            ->name('admin.reports.overtime-export-excel');

        // Master Hari Libur (Holiday Management)
        Route::get('holidays', [Admin\HolidayController::class, 'index'])
            ->name('admin.holidays.index');
        Route::post('holidays', [Admin\HolidayController::class, 'store'])
            ->name('admin.holidays.store');
        Route::put('holidays/{holiday}', [Admin\HolidayController::class, 'update'])
            ->name('admin.holidays.update');
        Route::delete('holidays/{holiday}', [Admin\HolidayController::class, 'destroy'])
            ->name('admin.holidays.destroy');
    });
