import { Head } from '@inertiajs/react';

/**
 * Daftar Riwayat Lembur Karyawan (FR-OVT-01)
 *
 * Menampilkan seluruh entri lembur yang pernah disubmit karyawan.
 * Termasuk: tanggal, jam mulai/selesai, durasi, proyek, keterangan.
 */
export default function OvertimeIndex() {
    return (
        <>
            <Head title="Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Lembur
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Riwayat pencatatan lembur Anda.
                        </p>
                    </div>
                    {/* TODO: Link to create overtime */}
                </div>

                {/* TODO: Implement overtime list table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel riwayat lembur akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

OvertimeIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/employee/dashboard' },
        { title: 'Lembur', href: '/employee/overtime' },
    ],
});
