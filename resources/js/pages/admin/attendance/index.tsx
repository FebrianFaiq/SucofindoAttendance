import { Head } from '@inertiajs/react';

/**
 * Tabel Kehadiran Admin (FR-ADM-03)
 *
 * Tabel detail kehadiran dengan kolom:
 * - Karyawan
 * - Proyek
 * - Jam Masuk
 * - Jam Keluar
 * - Status Kehadiran (flag: Belum Check In, Sudah Check In, dll.)
 * - WFO / WFA
 * - Lembur (indikator ada/tidak)
 *
 * Filter: Tanggal, Karyawan, Proyek (FR-ADM-02)
 */
export default function AttendanceIndex() {
    return (
        <>
            <Head title="Kehadiran" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Kehadiran
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Data kehadiran seluruh karyawan dengan filter.
                    </p>
                </div>

                {/* TODO: Filter bar */}
                <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-sm text-neutral-400">
                        Filter (Tanggal, Karyawan, Proyek) akan ditampilkan di sini.
                    </p>
                </div>

                {/* TODO: Attendance table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel kehadiran detail akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

AttendanceIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kehadiran', href: '/admin/attendance' },
    ],
});
