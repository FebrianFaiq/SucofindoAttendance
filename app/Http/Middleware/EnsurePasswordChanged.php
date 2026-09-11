<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $exempt = $request->routeIs('force-change-password') || $request->routeIs('logout');

        if ($user && $user->must_change_password && ! $exempt) {
            return redirect()->route('force-change-password');
        }

        return $next($request);
    }
}
