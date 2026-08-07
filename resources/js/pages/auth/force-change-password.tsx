import { Head } from '@inertiajs/react';

/**
 * Halaman Wajib Ganti Password (FR-AUTH-02)
 *
 * Ditampilkan setelah login pertama menggunakan password sementara dari Admin.
 * User tidak dapat melewati halaman ini sebelum password berhasil diganti.
 */
export default function ForceChangePassword() {
    return (
        <>
            <Head title="Ganti Password" />
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Ganti Password
                    </h1>
                    <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
                        Anda wajib mengganti password sebelum dapat menggunakan sistem.
                        Silakan masukkan password baru Anda.
                    </p>
                    {/* TODO: Implement password change form */}
                    <div className="rounded-lg bg-neutral-50 p-4 text-center text-sm text-neutral-400 dark:bg-neutral-900">
                        Form ganti password akan diimplementasikan di sini.
                    </div>
                </div>
            </div>
        </>
    );
}

ForceChangePassword.layout = () => ({
    title: 'Ganti Password',
    description: 'Wajib ganti password di login pertama',
});
