<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Fortify Service Provider — diminimalkan.
 *
 * Autentikasi Web Admin ditangani oleh App\Http\Controllers\Web\AuthController
 * menggunakan session Laravel biasa, BUKAN Fortify views/actions.
 * Ref: BE Framework §5
 *
 * Provider ini tetap ada karena Fortify masih terdaftar sebagai dependency,
 * tapi tidak mendaftarkan views, actions, atau routes tambahan apapun.
 */
class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
