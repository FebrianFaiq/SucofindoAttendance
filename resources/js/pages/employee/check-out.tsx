import { Head } from '@inertiajs/react';

/**
 * Halaman Check Out Karyawan (FR-ATT-02)
 *
 * Form check-out dengan:
 * - Capture foto via kamera
 * - Capture GPS otomatis
 * - Catatan kerjaan harian (wajib diisi)
 */
export default function CheckOut() {
    return (
        <>
            <Head title="Check Out" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Check Out
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Lakukan check-out dan isi catatan kerjaan hari ini.
                    </p>
                </div>

                {/* TODO: Implement check-out form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="space-y-4">
                        <div className="aspect-video rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            Kamera capture foto akan ditampilkan di sini.
                        </div>
                        <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            GPS location akan ditampilkan di sini.
                        </div>
                        <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            Catatan kerjaan harian (wajib) akan ditampilkan di sini.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CheckOut.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/employee/dashboard' },
        { title: 'Check Out', href: '/employee/check-out' },
    ],
});
