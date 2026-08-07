import { Head } from '@inertiajs/react';

/**
 * Halaman Rekap & Export Kehadiran (FR-EXP-01)
 *
 * Fitur:
 * - Rekap kehadiran bulanan
 * - Filter: Karyawan, Proyek, Tanggal (rentang)
 * - Export: CSV atau Excel
 */
export default function ReportsIndex() {
    return (
        <>
            <Head title="Rekap & Export" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Rekap Kehadiran
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Rekap bulanan dan export data kehadiran.
                        </p>
                    </div>
                    {/* TODO: Export buttons (CSV / Excel) */}
                </div>

                {/* TODO: Filter bar */}
                <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-sm text-neutral-400">
                        Filter (Bulan, Karyawan, Proyek, Rentang Tanggal) akan ditampilkan di sini.
                    </p>
                </div>

                {/* TODO: Report table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel rekap kehadiran akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Rekap & Export', href: '/admin/reports' },
    ],
});
