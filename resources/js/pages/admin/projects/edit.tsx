import { Head } from '@inertiajs/react';

/**
 * Form Edit Proyek
 *
 * Admin dapat memperbarui data proyek.
 */
export default function ProjectsEdit() {
    return (
        <>
            <Head title="Edit Proyek" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Edit Proyek
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Perbarui data proyek.
                    </p>
                </div>

                {/* TODO: Implement edit project form */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                        Form edit proyek akan ditampilkan di sini.
                    </div>
                </div>
            </div>
        </>
    );
}

ProjectsEdit.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Proyek', href: '/admin/projects' },
        { title: 'Edit', href: '#' },
    ],
});
