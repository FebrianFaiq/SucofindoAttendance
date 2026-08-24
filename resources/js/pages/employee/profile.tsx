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
interface ProfileProps {
    employee: any;
    activeProject: any;
    activeSalary: any;
}

export default function Profile({ employee, activeProject, activeSalary }: ProfileProps) {
    return (
        <>
            <Head title="Profil" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-sucofindo-light">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Profil Saya
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Informasi profil Anda.
                    </p>
                </div>

                <div className="mx-auto w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="space-y-4 text-sm text-neutral-700">
                        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-neutral-100 pb-3">
                            <span className="font-semibold text-neutral-500 uppercase text-[10px] tracking-wider self-center">Nama</span>
                            <span className="font-medium text-neutral-900">{employee?.user?.name || '—'}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-neutral-100 pb-3">
                            <span className="font-semibold text-neutral-500 uppercase text-[10px] tracking-wider self-center">Email</span>
                            <span className="font-medium text-neutral-900">{employee?.user?.email || '—'}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-neutral-100 pb-3">
                            <span className="font-semibold text-neutral-500 uppercase text-[10px] tracking-wider self-center">NIK</span>
                            <span className="font-medium text-neutral-900">{employee?.nik || '—'}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-neutral-100 pb-3">
                            <span className="font-semibold text-neutral-500 uppercase text-[10px] tracking-wider self-center">Telepon</span>
                            <span className="font-medium text-neutral-900">{employee?.phone || '—'}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-neutral-100 pb-3">
                            <span className="font-semibold text-neutral-500 uppercase text-[10px] tracking-wider self-center">
                                {employee?.user?.role === 'intern' ? 'Bidang' : 'Proyek Aktif'}
                            </span>
                            <span className="font-medium text-neutral-900">
                                {employee?.user?.role === 'intern' 
                                    ? (employee?.division || '—') 
                                    : (activeProject?.name || 'Belum Ditugaskan')}
                            </span>
                        </div>
                        {employee?.user?.role === 'employee' && (
                            <div className="grid grid-cols-[120px_1fr] gap-2 pb-1">
                                <span className="font-semibold text-neutral-500 uppercase text-[10px] tracking-wider self-center">Gaji Pokok</span>
                                <span className="font-bold text-[#035EA9]">
                                    {activeSalary ? `Rp ${Number(activeSalary.base_salary).toLocaleString('id-ID')}` : 'Belum Diset'}
                                </span>
                            </div>
                        )}
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
