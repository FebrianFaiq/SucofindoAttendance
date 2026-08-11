<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * Shared data tersedia di semua halaman Inertia (React) via `usePage().props`.
     * Ref: BE Framework §7.0 — data ke frontend otomatis jadi props komponen React
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $employee = $user?->employee;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'must_change_password' => $user->must_change_password,
                ] : null,
                'employee' => $employee ? [
                    'id' => $employee->id,
                    'employee_code' => $employee->employee_code,
                    'nik' => $employee->nik,
                    'phone' => $employee->phone,
                ] : null,
                'activeProject' => $employee?->activeProject()?->only('id', 'name', 'code'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
