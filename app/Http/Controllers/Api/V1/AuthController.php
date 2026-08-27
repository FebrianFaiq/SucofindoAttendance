<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Autentikasi API Mobile — Token-based (Sanctum).
 *
 * Login menghasilkan token Bearer, logout me-revoke token aktif.
 * Logika validasi (rate limiting, is_active) sama dengan Web AuthController.
 */
class AuthController extends Controller
{
    /**
     * Login — menghasilkan Sanctum token.
     *
     * POST /api/v1/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Rate limiting (sama seperti web: maks 5 percobaan per email+IP)
        $throttleKey = Str::transliterate(Str::lower($request->string('email')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'status' => 'error',
                'message' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
            ], 429);
        }

        // Attempt login
        if (! Auth::attempt($request->only('email', 'password'))) {
            RateLimiter::hit($throttleKey);

            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        /** @var User $user */
        $user = Auth::user();

        // Cek is_active
        if (! $user->is_active) {
            Auth::guard('web')->logout();
            RateLimiter::hit($throttleKey);

            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda telah dinonaktifkan. Hubungi admin.',
            ], 403);
        }

        // Cek role — hanya employee & intern yang boleh login via mobile
        if ($user->isAdmin()) {
            Auth::guard('web')->logout();

            return response()->json([
                'status' => 'error',
                'message' => 'Akun admin tidak dapat login melalui aplikasi mobile.',
            ], 403);
        }

        RateLimiter::clear($throttleKey);

        // Update last_login_at
        $user->update(['last_login_at' => now()]);

        // Buat token Sanctum
        $token = $user->createToken('mobile-app')->plainTextToken;

        // Load employee relationship
        $user->load('employee');

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'must_change_password' => $user->must_change_password,
                    'employee' => $user->employee ? [
                        'id' => $user->employee->id,
                        'nik' => $user->employee->nik,
                        'division' => $user->employee->division,
                        'phone' => $user->employee->phone,
                    ] : null,
                ],
            ],
        ]);
    }

    /**
     * Logout — revoke token aktif.
     *
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke token yang sedang dipakai saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * Ganti password wajib untuk mobile.
     *
     * POST /api/v1/auth/change-password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        /** @var User $user */
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        \App\Models\PasswordChangeLog::create([
            'user_id' => $user->id,
            'changed_by' => $user->id,
            'method' => 'self_change',
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diubah',
            'data' => [
                'must_change_password' => false,
            ]
        ]);
    }
}
