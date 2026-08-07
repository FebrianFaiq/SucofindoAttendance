import { Head } from '@inertiajs/react';

/**
 * Daftar Proyek (FR-PROJ-01)
 *
 * Menampilkan data master proyek yang tersedia untuk penugasan.
 * Admin dapat: tambah, edit, hapus proyek.
 */
export default function ProjectsIndex() {
    return (
        <>
            <Head title="Manajemen Proyek" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Manajemen Proyek
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola data master proyek untuk penugasan karyawan.
                        </p>
                    </div>
                    {/* TODO: Button Tambah Proyek */}
                </div>

                {/* TODO: Project list table */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-center text-sm text-neutral-400">
                        Tabel daftar proyek akan ditampilkan di sini.
                    </p>
                </div>
            </div>
        </>
    );
}

ProjectsIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Proyek', href: '/admin/projects' },
    ],
});
