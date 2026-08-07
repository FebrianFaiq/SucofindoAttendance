import { Head } from '@inertiajs/react';

/**
 * Detail Karyawan + Penugasan Proyek
 * (FR-EMP-04, FR-EMP-05)
 *
 * Menampilkan:
 * - Data karyawan (nama, email, ID, status)
 * - Daftar penugasan proyek (aktif & riwayat)
 * - Aksi: assign ke proyek, reassign, reset password
 */
export default function EmployeesShow() {
    return (
        <>
            <Head title="Detail Karyawan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Detail Karyawan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Informasi karyawan dan penugasan proyek.
                        </p>
                    </div>
                    {/* TODO: Action buttons (edit, reset password) */}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Employee Info */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Informasi Karyawan
                        </h2>
                        <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-400 dark:bg-neutral-900">
                            Data karyawan akan ditampilkan di sini.
                        </div>
                    </div>

                    {/* Project Assignments */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Penugasan Proyek
                        </h2>
                        <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-400 dark:bg-neutral-900">
                            Daftar proyek aktif dan riwayat penugasan akan ditampilkan di sini.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

EmployeesShow.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Karyawan', href: '/admin/employees' },
        { title: 'Detail', href: '#' },
    ],
});
