import { Head } from '@inertiajs/react';

/**
 * Riwayat Kehadiran Karyawan (FR-ATT-03)
 *
 * Menampilkan riwayat kehadiran karyawan:
 * - Tanggal
 * - Jam Masuk / Keluar
 * - Proyek
 * - Status WFO/WFA
 * - Catatan kerjaan
 */
export default function History() {
    return (
        <>
            <Head title="Riwayat Kehadiran" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Riwayat Kehadiran
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Catatan kehadiran Anda selama bekerja.
                    </p>
                </div>

                {/* TODO: Implement attendance history table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel riwayat kehadiran akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

History.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/employee/dashboard' },
        { title: 'Riwayat Kehadiran', href: '/employee/history' },
    ],
});
