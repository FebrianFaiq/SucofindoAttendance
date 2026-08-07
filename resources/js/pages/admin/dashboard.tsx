import { Head } from '@inertiajs/react';

/**
 * Dashboard Admin (FR-ADM-01, FR-ADM-02, FR-ADM-03)
 *
 * KPI Cards:
 * 1. Total Karyawan
 * 2. Hadir Hari Ini
 * 3. WFO Hari Ini
 * 4. WFA Hari Ini
 * 5. Belum Check In
 * 6. Belum Check Out
 * 7. Lembur Hari Ini
 *
 * Filter: Tanggal, Karyawan, Proyek
 * Tabel: Karyawan, Proyek, Jam Masuk, Jam Keluar, Status, WFO/WFA, Lembur
 */
export default function AdminDashboard() {
    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Dashboard
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ringkasan kehadiran dan monitoring karyawan.
                    </p>
                </div>

                {/* TODO: KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        'Total Karyawan',
                        'Hadir Hari Ini',
                        'WFO Hari Ini',
                        'WFA Hari Ini',
                        'Belum Check In',
                        'Belum Check Out',
                        'Lembur Hari Ini',
                    ].map((label) => (
                        <div
                            key={label}
                            className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
                        >
                            <p className="text-xs font-medium text-neutral-500">{label}</p>
                            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                                —
                            </p>
                        </div>
                    ))}
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
                        Tabel kehadiran admin akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = () => ({
    breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
});
