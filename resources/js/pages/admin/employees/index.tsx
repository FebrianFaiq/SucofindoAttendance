import { Head } from '@inertiajs/react';

/**
 * Daftar Karyawan (FR-EMP)
 *
 * Menampilkan daftar seluruh karyawan PTT/Proyek.
 * Admin dapat: tambah, edit, nonaktifkan/hapus, reset password.
 */
export default function EmployeesIndex() {
    return (
        <>
            <Head title="Manajemen Karyawan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Manajemen Karyawan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola data karyawan PTT / Karyawan Proyek.
                        </p>
                    </div>
                    {/* TODO: Button Tambah Karyawan */}
                </div>

                {/* TODO: Employee list table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel daftar karyawan akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

EmployeesIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Karyawan', href: '/admin/employees' },
    ],
});
