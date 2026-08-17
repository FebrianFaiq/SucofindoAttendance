import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Loader2,
    LogIn as LogInIcon,
    LogOut as LogOutIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';

// ─── Types ─────────────────────────────────────────────────────────────────

interface CheckOutProps {
    hasCheckedIn: boolean;
    alreadyCheckedOut: boolean;
    todayAttendance: {
        id: number;
        check_in_at: string;
        check_out_at: string | null;
    } | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getTodayFormatted(): string {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function calculateDuration(checkInStr: string): string {
    const checkIn = new Date(checkInStr);
    const now = new Date();
    const diffMs = now.getTime() - checkIn.getTime();
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}j ${minutes}m`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function CheckOut({
    hasCheckedIn,
    alreadyCheckedOut,
    todayAttendance,
}: CheckOutProps) {
    const page = usePage();

    // Live clock
    const [time, setTime] = useState(
        new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }),
    );

    // Live duration
    const [duration, setDuration] = useState(
        todayAttendance?.check_in_at
            ? calculateDuration(todayAttendance.check_in_at)
            : '0j 0m',
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(
                new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
            );
            if (todayAttendance?.check_in_at) {
                setDuration(calculateDuration(todayAttendance.check_in_at));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [todayAttendance]);

    // Form
    const { data, setData, post, processing, errors } = useForm({
        work_notes: '',
    });

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employee/check-out');
    };

    // Errors
    const pageErrors = page.props.errors as Record<string, string> | undefined;
    const serverErrors = pageErrors
        ? Object.values(pageErrors).filter(Boolean)
        : [];

    // Guard: belum check-in
    if (!hasCheckedIn) {
        return (
            <>
                <Head title="Check Out" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7]">
                            <LogInIcon className="h-8 w-8 text-[#D97706]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Anda belum Check In
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Silakan lakukan Check In terlebih dahulu sebelum melakukan Check Out.
                        </p>
                        <Link
                            href="/employee/check-in"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#024a87]"
                        >
                            <LogInIcon className="h-4 w-4" />
                            Check In Sekarang
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Guard: sudah check-out
    if (alreadyCheckedOut) {
        return (
            <>
                <Head title="Check Out" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
                            <LogOutIcon className="h-8 w-8 text-[#059669]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Anda sudah Check Out hari ini
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Silakan kembali ke dashboard untuk melihat ringkasan kehadiran Anda.
                        </p>
                        <Link
                            href="/employee/dashboard"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#024a87]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const clockInTime = todayAttendance?.check_in_at
        ? formatTime(todayAttendance.check_in_at)
        : '--:--';

    return (
        <>
            <Head title="Check Out" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Main Card */}
                <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-[#F3F4F6] px-6 py-4">
                        <Link
                            href="/employee/dashboard"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#14141A]"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="text-lg font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Clock Out
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Error display */}
                        {serverErrors.length > 0 && (
                            <div className="mb-6 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4">
                                <ul className="list-inside list-disc text-sm text-[#DC2626]">
                                    {serverErrors.map((error, i) => (
                                        <li key={i}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Live Clock */}
                        <div className="text-center mb-6">
                            <p className="text-5xl md:text-7xl font-extrabold text-[#035EA9] font-['Mulish',sans-serif] tracking-tight">
                                {time}
                            </p>
                            <p className="mt-2 text-sm text-[#6B7280]">
                                {getTodayFormatted()}
                            </p>
                        </div>

                        {/* Clock In & Duration Card */}
                        <div className="mb-8 rounded-xl border border-[#E5E7EB] bg-white">
                            <div className="grid grid-cols-2 divide-x divide-[#E5E7EB]">
                                <div className="p-5 text-center">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                                        Clock In
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <LogInIcon className="h-4 w-4 text-[#6B7280]" />
                                        <span className="text-lg font-bold text-[#14141A] font-['Mulish',sans-serif]">
                                            {clockInTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 text-center">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                                        Durasi Kerja
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-lg font-bold text-[#035EA9] font-['Mulish',sans-serif]">
                                            {duration}
                                        </span>
                                        <Clock className="h-4 w-4 text-[#035EA9]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Catatan Pekerjaan */}
                        <div className="mb-8">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-3">
                                Catatan Pekerjaan
                            </h3>
                            <textarea
                                value={data.work_notes}
                                onChange={(e) => setData('work_notes', e.target.value)}
                                placeholder="Ceritakan pekerjaan atau aktivitas yang Anda lakukan hari ini..."
                                rows={5}
                                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#14141A] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#035EA9] focus:ring-2 focus:ring-[#035EA9]/10 resize-none"
                            />
                            <InputError message={errors.work_notes} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={processing || !data.work_notes.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#024a87] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                {processing ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <LogOutIcon className="h-5 w-5" />
                                )}
                                {processing ? 'Memproses...' : 'Konfirmasi Clock Out'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

CheckOut.layout = () => ({
    breadcrumbs: [
        { title: 'Absensi', href: '/employee/dashboard' },
        { title: 'Check Out', href: '/employee/check-out' },
    ],
});
