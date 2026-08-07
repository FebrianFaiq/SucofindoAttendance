import { Head } from '@inertiajs/react';

/**
 * Halaman Check In Karyawan (FR-ATT-01)
 *
 * Form check-in dengan:
 * - Pilihan WFO / WFA
 * - Capture foto via kamera
 * - Capture GPS otomatis
 * - Auto-tag proyek aktif
 */
export default function CheckIn() {
    return (
        <>
            <Head title="Check In" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Check In
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Lakukan check-in kehadiran Anda hari ini.
                    </p>
                </div>

                {/* TODO: Implement check-in form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="space-y-4">
                        <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            Pilihan WFO / WFA akan ditampilkan di sini.
                        </div>
                        <div className="aspect-video rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            Kamera capture foto akan ditampilkan di sini.
                        </div>
                        <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            GPS location akan ditampilkan di sini.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CheckIn.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/employee/dashboard' },
        { title: 'Check In', href: '/employee/check-in' },
    ],
});
