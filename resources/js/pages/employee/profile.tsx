import { Head } from '@inertiajs/react';

/**
 * Profil Karyawan — Read Only (FR-ATT-04)
 *
 * Menampilkan:
 * - Nama
 * - Email
 * - Proyek yang sedang berjalan
 *
 * Edit profil mandiri belum termasuk scope v1.0.
 */
export default function Profile() {
    return (
        <>
            <Head title="Profil" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Profil Saya
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Informasi profil Anda.
                    </p>
                </div>

                {/* TODO: Implement profile display */}
                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="space-y-4">
                        <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-400 dark:bg-neutral-900">
                            <p><span className="font-medium text-neutral-500">Nama:</span> —</p>
                            <p className="mt-2"><span className="font-medium text-neutral-500">Email:</span> —</p>
                            <p className="mt-2"><span className="font-medium text-neutral-500">Proyek Aktif:</span> —</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Profile.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/employee/dashboard' },
        { title: 'Profil', href: '/employee/profile' },
    ],
});
