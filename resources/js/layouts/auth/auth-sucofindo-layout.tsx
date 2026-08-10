import type { PropsWithChildren } from 'react';

/**
 * Auth layout khas SUCOFINDO — split layout:
 * - Kiri:  gambar gedung Graha Sucofindo (rounded corners)
 * - Kanan: form login di dalam card putih
 *
 * Background: lavender/light blue (#F0F0FA) — turunan dari --color-sucofindo-light
 */
export default function AuthSucofindoLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-sucofindo-light p-4 md:p-8 lg:p-12">
            <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* ─── Kiri: Gambar Gedung ─── */}
                <div className="relative hidden w-1/2 lg:block">
                    {/*
                     * TODO: Ganti src di bawah dengan path gambar Graha Sucofindo.
                     * Contoh: src="/images/graha-sucofindo.png"
                     * Pastikan gambar landscape/portrait yang menunjukkan
                     * gedung Graha Sucofindo (seperti pada desain mockup).
                     * Ukuran yang disarankan: min. 800x900px, format JPG/WebP.
                     */}
                    <img
                        src="/images/graha-sucofindo.png"
                        alt="Graha Sucofindo"
                        className="h-full w-full object-cover"
                    />
                    {/* Fallback background jika gambar belum ada */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sucofindo-primary to-sucofindo-blue" />
                </div>

                {/* ─── Kanan: Form Area ─── */}
                <div className="flex w-full flex-col items-center justify-center px-8 py-12 sm:px-12 lg:w-1/2 lg:px-16">
                    {children}
                </div>
            </div>
        </div>
    );
}
