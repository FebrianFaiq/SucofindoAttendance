import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    LogIn as LogInIcon,
    LogOut as LogOutIcon,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { ServiceSelectorModal } from '@/components/service-selector-modal';
import type { User } from '@/types';

// ─── Types ─────────────────────────────────────────────────────────────────

interface AttendanceRecord {
    id: number;
    date: string;
    date_raw: string;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    is_late: boolean;
    type: string;
    project_name: string;
    duration: string | null;
}

interface EmployeeDashboardProps {
    hasCheckedIn: boolean;
    hasCheckedOut: boolean;
    clockInTime: string | null;
    clockOutTime: string | null;
    totalDuration: string;
    recentAttendances: AttendanceRecord[];
    detectedLocation: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 11) {
return 'Selamat Pagi';
}

    if (hour < 15) {
return 'Selamat Siang';
}

    if (hour < 18) {
return 'Selamat Sore';
}

    return 'Selamat Malam';
}

function getTodayFormatted(): string {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function EmployeeDashboard({
    hasCheckedIn,
    hasCheckedOut,
    clockInTime,
    clockOutTime,
    totalDuration,
    recentAttendances,
    detectedLocation,
}: EmployeeDashboardProps) {
    const page = usePage();
    const user = page.props.auth?.user as User | undefined;

    return (
        <>
            <Head title="Dashboard" />
            {user?.role !== 'intern' && <ServiceSelectorModal />}

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* ── Greeting Card ─────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-sm">
                    {/* Decorative Bubbles - Right Side (Asymmetrical & Clipped) */}
                    <div className="absolute -top-20 -right-12 h-72 w-72 rounded-full bg-[#035EA9] opacity-[0.03]" />
                    <div className="absolute top-1/2 -translate-y-1/2 -right-24 h-56 w-56 rounded-full bg-[#0781C4] opacity-[0.05]" />
                    <div className="absolute -bottom-16 right-20 h-48 w-48 rounded-full bg-[#139FDA] opacity-[0.04]" />
                    <div className="absolute top-8 right-40 h-16 w-16 rounded-full bg-[#035EA9] opacity-[0.06]" />

                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            {/* Status badge */}
                            {!hasCheckedIn ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#DC2626] mb-3">
                                    <Clock className="h-4 w-4" />
                                    Belum Absen Hari Ini
                                </span>
                            ) : hasCheckedOut ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#059669] mb-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                                    Sudah Selesai
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#035EA9] mb-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#035EA9]" />
                                    Sedang Bekerja
                                </span>
                            )}

                            <h1 className="text-2xl md:text-3xl font-extrabold text-[#14141A] font-['Mulish',sans-serif]">
                                {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Rekan'}!
                            </h1>
                            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                                {getTodayFormatted()} •{' '}
                                {!hasCheckedIn
                                    ? 'Silakan lakukan Clock In untuk memulai aktivitas.'
                                    : hasCheckedOut
                                      ? 'Anda sudah menyelesaikan hari kerja.'
                                      : 'Anda sedang bekerja. Jangan lupa Clock Out nanti.'}
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                            {!hasCheckedIn ? (
                                <Link
                                    href="/employee/check-in"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#024a87] hover:shadow-xl active:scale-[0.98]"
                                >
                                    <LogInIcon className="h-4 w-4" />
                                    Absen Hari ini
                                </Link>
                            ) : !hasCheckedOut ? (
                                <Link
                                    href="/employee/check-out"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#024a87] hover:shadow-xl active:scale-[0.98]"
                                >
                                    <LogOutIcon className="h-4 w-4" />
                                    Clock Out
                                </Link>
                            ) : (
                                <div className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-6 py-3.5 text-sm font-semibold text-neutral-500 cursor-not-allowed border-2 border-neutral-300">
                                    <AlertCircle className="h-4 w-4" />
                                    Sudah Absen Hari Ini
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Clock Status Cards ─────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Clock In */}
                    <div className="group relative overflow-hidden rounded-xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-l-[#10B981] hover:border-y-[#10B981]/30 hover:border-r-[#10B981]/30 hover:bg-[#F0FDF4]">
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 leading-tight uppercase tracking-wider">
                                    Clock In
                                </p>
                                <p className="mt-2 text-2xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                                    {clockInTime ?? '--:--'}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors bg-[#D1FAE5] group-hover:bg-[#BBF7D0]">
                                <LogInIcon className="h-5 w-5 text-[#059669]" />
                            </div>
                        </div>
                    </div>

                    {/* Clock Out */}
                    <div className="group relative overflow-hidden rounded-xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-l-[#EF4444] hover:border-y-[#EF4444]/30 hover:border-r-[#EF4444]/30 hover:bg-[#FEF2F2]">
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 leading-tight uppercase tracking-wider">
                                    Clock Out
                                </p>
                                <p className="mt-2 text-2xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                                    {clockOutTime ?? '--:--'}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors bg-[#FEE2E2] group-hover:bg-[#FECACA]">
                                <LogOutIcon className="h-5 w-5 text-[#DC2626]" />
                            </div>
                        </div>
                    </div>

                    {/* Total Durasi */}
                    <div className="group relative overflow-hidden rounded-xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-l-[#035EA9] hover:border-y-[#035EA9]/30 hover:border-r-[#035EA9]/30 hover:bg-[#F0F5FA]">
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 leading-tight uppercase tracking-wider">
                                    Total Durasi
                                </p>
                                <p className="mt-2 text-2xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                                    {totalDuration}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors bg-[#EFF6FF] group-hover:bg-[#DBEAFE]">
                                <Clock className="h-5 w-5 text-[#035EA9]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Aktivitas Terbaru ──────────────────────────────────── */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
                        <h2 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Riwayat Terbaru
                        </h2>
                        <Link
                            href="/employee/history"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#035EA9] transition-colors hover:text-[#024a87]"
                        >
                            Lihat Semua
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F3F4F6]">
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
                                {recentAttendances.length > 0 ? (
                                    recentAttendances.map((record) => (
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
                </div>
            </div>
        </>
    );
}

EmployeeDashboard.layout = () => ({
    breadcrumbs: [
        { title: 'Absensi', href: '/employee/dashboard' },
    ],
});
