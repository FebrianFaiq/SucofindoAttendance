import { Head } from '@inertiajs/react';

/**
 * Form Input Lembur Manual (FR-OVT-01)
 *
 * Karyawan mengisi:
 * - Tanggal
 * - Jam Mulai
 * - Jam Selesai
 * - Durasi
 * - Keterangan pekerjaan lembur
 *
 * Tidak ada validasi foto/GPS — murni input manual.
 * Proyek otomatis ditandai dari proyek aktif karyawan (FR-PROJ-02).
 */
export default function OvertimeCreate() {
    return (
        <>
            <Head title="Input Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-sucofindo-light">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Input Lembur
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Catat lembur Anda secara manual.
                    </p>
                </div>

                {/* TODO: Implement overtime form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="space-y-4">
                        <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                            Form input lembur (tanggal, jam mulai, jam selesai, durasi, keterangan) akan ditampilkan di sini.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

OvertimeCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/employee/dashboard' },
        { title: 'Lembur', href: '/employee/overtime' },
        { title: 'Input Lembur', href: '/employee/overtime/create' },
    ],
});
