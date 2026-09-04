<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

/**
 * Autentikasi Web (Admin & Employee) — session Laravel biasa (guard `web`).
 *
 * Login tunggal untuk kedua role, redirect ke dashboard sesuai role.
 * TIDAK menggunakan Sanctum — cukup session + CSRF token bawaan.
 * Ref: BE Framework §5 & §7.0
 */
class AuthController extends Controller
{
    /**
     * Tampilkan halaman login.
     *
     * GET /login
     */
    public function create(): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => true,
        ])->toResponse(request())->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    }

    /**
     * Proses login.
     *
     * POST /login
     *
     * Alur:
     * 1. Validasi email + password (via LoginRequest, termasuk rate limiting)
     * 2. Attempt login — gagal → pesan generik "Email atau password salah" (§9)
     * 3. Cek is_active — jika false → logout + return error "Akun dinonaktifkan"
     * 4. Update last_login_at
     * 5. Regenerate session (security best practice)
     * 6. Redirect ke /dashboard
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();
        $user->update(['last_login_at' => now()]);

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('employee.dashboard'));
    }

    /**
     * Proses logout.
     *
     * POST /logout
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
