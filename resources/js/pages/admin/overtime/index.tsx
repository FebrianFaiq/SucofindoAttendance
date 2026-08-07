import { Head } from '@inertiajs/react';

/**
 * Monitoring Lembur Admin (FR-OVT-02, FR-OVT-03)
 *
 * Menampilkan:
 * - Daftar seluruh entri lembur karyawan
 * - Kolom: nama, proyek, tanggal, jam mulai/selesai, durasi, keterangan
 * - Alert saat karyawan melebihi ambang batas lembur
 *
 * Tidak ada alur approval — murni monitoring/pendataan HRD.
 */
export default function AdminOvertimeIndex() {
    return (
        <>
            <Head title="Monitoring Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Monitoring Lembur
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Pantau pencatatan lembur seluruh karyawan.
                    </p>
                </div>

                {/* TODO: Alert for overtime threshold */}
                {/* TODO: Overtime table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel monitoring lembur dan alert ambang batas akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

AdminOvertimeIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Lembur', href: '/admin/overtime' },
    ],
});
