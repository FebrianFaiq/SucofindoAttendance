<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * Verifikasi bahwa user memiliki role yang sesuai.
     * Jika tidak, redirect ke dashboard sesuai role user.
     *
     * Usage: EnsureRole::class.':admin'
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== $role) {
            // Redirect ke dashboard sesuai role user
            if ($user && $user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('employee.dashboard');
        }

        return $next($request);
    }
}
