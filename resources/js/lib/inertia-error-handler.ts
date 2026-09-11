import { router } from '@inertiajs/react';
import { toast } from 'sonner';

/**
 * Global Inertia error interceptor.
 *
 * Menangkap error jaringan, timeout, dan response 500
 * yang tidak tertangani oleh handler lokal di masing-masing halaman.
 * Harus dipanggil sekali di entry point (app.tsx).
 */
export function registerGlobalErrorHandler(): void {
    // Intercept invalid/error Inertia responses (500, network errors, etc.)
    router.on('invalid', (event) => {
        const response = (event as CustomEvent).detail?.response;
        const status = response?.status;

        if (status === 419) {
            // CSRF token expired — session mungkin sudah habis
            toast.error('Sesi Anda telah berakhir. Halaman akan dimuat ulang.', {
                duration: 4000,
            });
            setTimeout(() => window.location.reload(), 2000);
        } else if (status === 503) {
            toast.error('Server sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.');
        } else if (status && status >= 500) {
            toast.error('Terjadi kesalahan pada server. Silakan coba lagi.');
        } else {
            // Network error / response tidak valid
            toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
        }

        event.preventDefault(); // Prevent Inertia's default modal
    });

    // Intercept Inertia exceptions (e.g. network failure during navigation)
    router.on('exception', (event) => {
        toast.error('Koneksi terputus atau terjadi kesalahan. Silakan coba lagi.');
        event.preventDefault();
    });
}
