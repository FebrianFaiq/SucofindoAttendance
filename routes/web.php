<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Web Admin (Inertia + React)
|--------------------------------------------------------------------------
|
| Rute Inertia untuk Web Admin — guard: web (session biasa).
| Ref: BE Framework §7.0
|
*/

// Redirect root ke dashboard
Route::redirect('/', '/dashboard');

// ───────────────────────────────────────────
// Guest Routes (belum login)
// ───────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'create'])->name('login');
    Route::post('login', [AuthController::class, 'store']);
});

// ───────────────────────────────────────────
// Authenticated + Admin Routes
// ───────────────────────────────────────────
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::post('logout', [AuthController::class, 'destroy'])->name('logout');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
