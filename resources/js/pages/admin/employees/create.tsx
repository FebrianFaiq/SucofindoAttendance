import { Head } from '@inertiajs/react';

/**
 * Form Tambah Karyawan (FR-EMP-01)
 *
 * Admin mengisi:
 * - Nama
 * - Email
 * - ID Karyawan
 * - Proyek awal (opsional)
 *
 * Sistem otomatis membuat password sementara dan menandai wajib ganti password.
 */
export default function EmployeesCreate() {
    return (
        <>
            <Head title="Tambah Karyawan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Tambah Karyawan
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Buat akun baru untuk karyawan PTT / Karyawan Proyek.
                    </p>
                </div>

                {/* TODO: Implement create employee form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                        Form tambah karyawan (Nama, Email, ID Karyawan, Proyek Awal) akan ditampilkan di sini.
                    </div>
                </div>
            </div>
        </>
    );
}

EmployeesCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Karyawan', href: '/admin/employees' },
        { title: 'Tambah Karyawan', href: '/admin/employees/create' },
    ],
});
