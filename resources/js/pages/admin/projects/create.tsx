import { Head } from '@inertiajs/react';

/**
 * Form Tambah Proyek
 *
 * Admin membuat proyek baru untuk penugasan karyawan.
 */
export default function ProjectsCreate() {
    return (
        <>
            <Head title="Tambah Proyek" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Tambah Proyek
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Buat proyek baru untuk penugasan karyawan.
                    </p>
                </div>

                {/* TODO: Implement create project form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                        Form tambah proyek akan ditampilkan di sini.
                    </div>
                </div>
            </div>
        </>
    );
}

ProjectsCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Proyek', href: '/admin/projects' },
        { title: 'Tambah Proyek', href: '/admin/projects/create' },
    ],
});
