import { Head } from '@inertiajs/react';

/**
 * Dashboard Karyawan
 *
 * Menampilkan ringkasan status kehadiran hari ini:
 * - Status check-in/check-out hari ini
 * - Proyek aktif
 * - Quick action: Check In / Check Out
 */
export default function EmployeeDashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Dashboard
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ringkasan status kehadiran Anda hari ini.
                    </p>
                </div>

                {/* TODO: Implement dashboard content */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <p className="text-sm font-medium text-neutral-500">Status Hari Ini</p>
                        <p className="mt-1 text-sm text-neutral-400">Belum Check In</p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <p className="text-sm font-medium text-neutral-500">Proyek Aktif</p>
                        <p className="mt-1 text-sm text-neutral-400">—</p>
                    </div>
                </div>

                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Quick actions dan riwayat singkat akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

EmployeeDashboard.layout = () => ({
    breadcrumbs: [{ title: 'Dashboard', href: '/employee/dashboard' }],
});
