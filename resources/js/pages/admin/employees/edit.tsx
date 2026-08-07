import { Head } from '@inertiajs/react';

/**
 * Form Edit Karyawan (FR-EMP-02)
 *
 * Admin dapat memperbarui:
 * - Nama
 * - Email
 * - ID Karyawan
 * - Status aktif/nonaktif
 */
export default function EmployeesEdit() {
    return (
        <>
            <Head title="Edit Karyawan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Edit Karyawan
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Perbarui data karyawan.
                    </p>
                </div>

                {/* TODO: Implement edit employee form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                        Form edit karyawan (Nama, Email, ID Karyawan, Status) akan ditampilkan di sini.
                    </div>
                </div>
            </div>
        </>
    );
}

EmployeesEdit.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Karyawan', href: '/admin/employees' },
        { title: 'Edit', href: '#' },
    ],
});
