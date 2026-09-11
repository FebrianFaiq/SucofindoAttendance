import { Head, usePage, Link } from '@inertiajs/react';
import type { User } from '@/types';

interface AttendanceRecord {
    id: number;
    date: string;
    clock_in: string | null;
    clock_out: string | null;
    type: string;
    project_name: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAttendances {
    data: AttendanceRecord[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

/**
 * Riwayat Kehadiran Karyawan (FR-ATT-03)
 *
 * Menampilkan riwayat kehadiran karyawan:
 * - Tanggal
 * - Jam Masuk / Keluar
 * - Mode
 * - Proyek
 */
export default function History({ attendances }: { attendances: PaginatedAttendances }) {
    const page = usePage();
    const user = page.props.auth?.user as User | undefined;

    return (
        <>
            <Head title="Riwayat Kehadiran" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-sucofindo-light">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Riwayat Kehadiran
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Catatan kehadiran Anda selama bekerja.
                    </p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-neutral-50">
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                        Clock In
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                        Clock Out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                        Mode
                                    </th>
                                    {user?.role !== 'intern' && (
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                            Proyek
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="border-b border-[#F9FAFB] last:border-0 transition-colors hover:bg-[#FAFBFC]"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-[#14141A]">
                                                {record.date}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#374151]">
                                                {record.clock_in ?? '--:--'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#374151]">
                                                {record.clock_out ?? '--:--'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-[#14141A]">
                                                    {record.type}
                                                </div>
                                            </td>
                                            {user?.role !== 'intern' && (
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[#374151]">
                                                        {record.project_name || '-'}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={user?.role === 'intern' ? 4 : 5}
                                            className="px-6 py-12 text-center text-sm text-[#9CA3AF]"
                                        >
                                            Belum ada data aktivitas kehadiran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attendances.links.length > 3 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#F3F4F6] px-6 py-4 gap-4">
                            <p className="text-sm text-neutral-500">
                                Menampilkan <span className="font-medium">{attendances.from ?? 0}</span> sampai{' '}
                                <span className="font-medium">{attendances.to ?? 0}</span> dari{' '}
                                <span className="font-medium">{attendances.total}</span> data
                            </p>
                            <div className="flex gap-1 overflow-x-auto max-w-full pb-2 sm:pb-0">
                                {attendances.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        className={`flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-[#035EA9] text-white'
                                                : link.url
                                                  ? 'text-neutral-600 hover:bg-neutral-100'
                                                  : 'text-neutral-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

History.layout = () => ({
    breadcrumbs: [
        { title: 'Absensi', href: '/employee/dashboard' },
        { title: 'Riwayat Kehadiran', href: '/employee/history' },
    ],
});
