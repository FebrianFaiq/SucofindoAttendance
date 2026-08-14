import { Head, Link, router } from '@inertiajs/react';
import { Search, UserSearch, ChevronLeft, ChevronRight, Download, LogIn, LogOut, Building2, FolderKanban, MapPin, ScanFace, ClipboardPenLine, CalendarX2, ListFilter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface AttendanceItem {
    id: number;
    employee_id: number;
    type: string;
    check_in_at: string | null;
    check_out_at: string | null;
    check_in_latitude: number | null;
    check_in_longitude: number | null;
    work_notes: string | null;
    employee: {
        nik: string;
        employee_code?: string;
        user: {
            name: string;
            email: string;
        };
        projects: {
            name: string;
            code: string;
        }[];
    };
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface AttendanceIndexProps {
    attendances: PaginatedData<AttendanceItem>;
    filters?: {
        start_date?: string;
        end_date?: string;
        search?: string;
    };
}

export default function AttendanceIndex({ attendances, filters }: AttendanceIndexProps) {
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceItem | null>(null);



    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/attendance',
            { start_date: startDate, end_date: endDate, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
        router.get('/admin/attendance', {}, { preserveState: true, replace: true });
    };

    const openDetails = (item: AttendanceItem) => {
        setSelectedAttendance(item);
        setIsSheetOpen(true);
    };

    const getInitials = (name: string) => {
        if (!name) return 'EM';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatTime12 = (dateString: string | null) => {
        if (!dateString) return { time: '—', period: '' };
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return { time: `${hours.toString().padStart(2, '0')}:${minutes}`, period };
    };

    const calculateTotalHours = (checkIn: string | null, checkOut: string | null) => {
        if (!checkIn || !checkOut) return '—';
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffMs = end.getTime() - start.getTime();
        if (diffMs <= 0) return '—';
        const totalMinutes = Math.floor(diffMs / 60000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h ${m}m`;
    };

    const isLate = (dateString: string | null) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date.getHours() >= 8 && date.getMinutes() > 0;
    };

    return (
        <>
            <Head title="Kehadiran" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#F9F9FF] p-6 font-mulish">
                
                {/* ── Header ────────────────────────────── */}
                <div className="flex flex-col gap-1 mt-2">
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Monitoring Absensi Karyawan</h1>
                    <p className="text-neutral-500 font-medium">Riwayat Aktivitas Kehadiran Hari ini</p>
                </div>

                {/* ── Filter Bar ────────────────────────────── */}
                <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-6 py-5 shadow-sm">
                    <style>{`
                        input[type="date"].date-right-icon::-webkit-calendar-picker-indicator {
                            position: absolute;
                            right: 12px;
                            top: 50%;
                            transform: translateY(-50%);
                            cursor: pointer;
                            opacity: 0.5;
                        }
                        input[type="date"].date-right-icon {
                            position: relative;
                        }
                    `}</style>
                    <form onSubmit={handleFilter} className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-5">
                        {/* Start Date */}
                        <div className="w-full lg:w-[200px] shrink-0">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">Start Date</label>
                            <Input 
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="date-right-icon w-full h-[42px] rounded-lg border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9] font-medium text-neutral-600 px-3 pr-10" 
                            />
                        </div>

                        {/* End Date */}
                        <div className="w-full lg:w-[200px] shrink-0">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">End Date</label>
                            <Input 
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="date-right-icon w-full h-[42px] rounded-lg border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9] font-medium text-neutral-600 px-3 pr-10" 
                            />
                        </div>

                        {/* Karyawan / Proyek */}
                        <div className="flex-1 min-w-0">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">Karyawan / Proyek</label>
                            <div className="relative">
                                <UserSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <Input 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari..." 
                                    className="pl-10 h-[42px] w-full rounded-lg border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9] text-sm" 
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-end gap-3 shrink-0">
                            <Button 
                                type="button"
                                onClick={handleReset}
                                variant="outline" 
                                className="h-[42px] min-w-[90px] rounded-lg border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 text-center text-xs leading-[1.3] px-4 py-1"
                            >
                                Reset{'\n'}Filter
                            </Button>
                            <Button 
                                type="submit"
                                className="h-[42px] min-w-[90px] rounded-lg bg-[#035EA9] font-bold text-white shadow-sm hover:bg-[#035EA9]/90 text-center text-xs leading-[1.3] px-4 py-1"
                            >
                                Terapkan{'\n'}Filter
                            </Button>
                        </div>
                    </form>
                </div>

                {/* ── Table Container ───────────────────────────────── */}
                <div className="mt-2 flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Data Kehadiran</h2>
                        <Button variant="outline" className="h-9 border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 flex gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-neutral-600 whitespace-nowrap border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">Karyawan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Proyek</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Clock In</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Clock Out</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Mode</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            {attendances.data.length > 0 && (
                                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                    {attendances.data.map((item) => {
                                        const clockIn = formatTime(item.check_in_at);
                                        const clockOut = formatTime(item.check_out_at);
                                        const late = isLate(item.check_in_at);
                                        
                                        return (
                                            <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-3 min-w-[250px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F0F9] font-bold text-[#035EA9] shrink-0">
                                                            {getInitials(item.employee?.user?.name)}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-neutral-900 leading-tight">{item.employee?.user?.name}</span>
                                                            <span className="text-xs font-semibold text-neutral-500">ID: {item.employee?.employee_code || item.employee?.nik}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 font-semibold text-neutral-600 min-w-[200px]">
                                                    <span className="leading-tight block whitespace-normal">
                                                        {item.employee?.projects?.[0]?.name ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                                    <span className={`font-bold ${late ? 'text-[#DC2626]' : 'text-neutral-700'}`}>
                                                        {clockIn}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-center font-bold text-neutral-700 whitespace-nowrap">
                                                    {clockOut}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <Badge className="rounded-md border-none bg-[#E0E7FF] text-[#4338CA] hover:bg-[#E0E7FF]/80 px-2.5 py-1 text-[13px] font-bold">
                                                        {item.type || 'WFO'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3 text-right whitespace-nowrap">
                                                    <button 
                                                        onClick={() => openDetails(item)}
                                                        className="font-bold text-[#035EA9] hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>
                    {attendances.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center w-full border-t border-neutral-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F0F9] mb-4">
                                <CalendarX2 className="h-7 w-7 text-[#035EA9]" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Tidak ada data kehadiran</h3>
                            <p className="text-sm font-medium text-neutral-500 mx-auto max-w-[400px] text-center leading-relaxed whitespace-normal">
                                Coba sesuaikan filter atau rentang tanggal untuk menemukan data yang Anda cari.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="mt-6 h-10 border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 flex items-center justify-center gap-2 px-5"
                            >
                                <ListFilter className="h-4 w-4" />
                                Hapus Semua Filter
                            </Button>
                        </div>
                    )}

                    {/* ── Pagination Footer ─────────────────────────────── */}
                    <div className="mt-auto flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 bg-white px-6 py-4 text-sm text-neutral-500 gap-4">
                        <span className="font-semibold text-[#64748B]">
                            Menampilkan {attendances.from ?? 0} - {attendances.to ?? 0} dari {attendances.total} data
                        </span>
                        <div className="flex items-center gap-1">
                            {attendances.prev_page_url ? (
                                <Link
                                    href={attendances.prev_page_url}
                                    preserveScroll
                                    className="flex h-8 w-8 items-center justify-center rounded text-[#94A3B8] hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 cursor-not-allowed">
                                    <ChevronLeft className="h-4 w-4" />
                                </span>
                            )}

                            {attendances.links
                                .filter((link) => !link.label.includes('&laquo;') && !link.label.includes('&raquo;'))
                                .map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveScroll
                                            className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold transition-colors ${
                                                link.active
                                                    ? 'bg-[#035EA9] text-white'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span key={idx} className="flex h-8 w-8 items-center justify-center text-neutral-400 font-bold">
                                            {link.label}
                                        </span>
                                    )
                                ))}

                            {attendances.next_page_url ? (
                                <Link
                                    href={attendances.next_page_url}
                                    preserveScroll
                                    className="flex h-8 w-8 items-center justify-center rounded text-[#94A3B8] hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 cursor-not-allowed">
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Attendance Details Drawer ──────────────── */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side="right" className="w-[400px] sm:w-[420px] p-0 font-mulish overflow-y-auto border-l border-neutral-200">
                        {selectedAttendance && (() => {
                            const clockIn12 = formatTime12(selectedAttendance.check_in_at);
                            const clockOut12 = formatTime12(selectedAttendance.check_out_at);
                            const totalHours = calculateTotalHours(selectedAttendance.check_in_at, selectedAttendance.check_out_at);
                            const employeeName = selectedAttendance.employee?.user?.name ?? 'Karyawan';
                            const empCode = selectedAttendance.employee?.employee_code || `EMP-${selectedAttendance.employee?.nik}`;
                            const projectName = selectedAttendance.employee?.projects?.[0]?.name ?? '—';
                            const mode = selectedAttendance.type?.toUpperCase() || 'WFO';
                            const isPresent = !!selectedAttendance.check_in_at;
                            const clockInTime = formatTime(selectedAttendance.check_in_at);
                            const clockOutTime = formatTime(selectedAttendance.check_out_at);

                            return (
                                <div className="flex flex-col">
                                    {/* ── Header: Profile ── */}
                                    <div className="flex items-start gap-3 px-6 pt-6 pb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F0F9] text-sm font-bold text-[#035EA9] shrink-0">
                                            {getInitials(employeeName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-neutral-900 leading-snug">{employeeName}</h3>
                                            <p className="text-xs font-medium text-neutral-500 mt-0.5">
                                                {empCode} · {projectName}
                                            </p>
                                        </div>
                                        <Badge className={`shrink-0 rounded-full border-none px-3 py-1 text-[11px] font-bold ${
                                            isPresent
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-red-50 text-red-600'
                                        }`}>
                                            {isPresent ? 'Present' : 'Absent'}
                                        </Badge>
                                    </div>

                                    {/* ── Section: Attendance Summary ── */}
                                    <div className="px-6 pb-5">
                                        <h4 className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-3">Attendance Summary</h4>
                                        
                                        {/* Clock In / Clock Out Cards */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Clock In */}
                                            <div className="rounded-xl border border-neutral-200 p-4 border-l-[3px] border-l-transparent hover:border-l-[#035EA9] hover:bg-[#EEF4FC] transition-colors cursor-default">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <LogIn className="h-3.5 w-3.5 text-[#035EA9]" />
                                                    <span className="text-[10px] font-bold text-[#035EA9] uppercase tracking-wider">Clock In</span>
                                                </div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-[28px] font-extrabold text-neutral-900 leading-none">{clockIn12.time}</span>
                                                    <span className="text-sm font-bold text-neutral-500">{clockIn12.period}</span>
                                                </div>
                                            </div>
                                            {/* Clock Out */}
                                            <div className="rounded-xl border border-neutral-200 p-4 border-l-[3px] border-l-transparent hover:border-l-[#035EA9] hover:bg-[#EEF4FC] transition-colors cursor-default">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <LogOut className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Clock Out</span>
                                                </div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-[28px] font-extrabold text-neutral-900 leading-none">{clockOut12.time}</span>
                                                    <span className="text-sm font-bold text-neutral-500">{clockOut12.period}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Total Hours / Mode */}
                                        <div className="mt-3 rounded-xl border border-neutral-200 px-4 py-3 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Total Hours</span>
                                                <span className="text-lg font-extrabold text-[#035EA9] leading-tight">{totalHours}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mode</span>
                                                <span className="text-lg font-extrabold text-neutral-900 leading-tight">{mode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Section: Activity Timeline ── */}
                                    <div className="px-6 pb-5">
                                        <h4 className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-4">Activity Timeline</h4>

                                        <div className="flex flex-col gap-0">
                                            {/* Timeline: Clock In */}
                                            <div className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-3 w-3 rounded-full bg-[#035EA9] shrink-0 mt-0.5" />
                                                    <div className="w-px flex-1 bg-neutral-200" />
                                                </div>
                                                <div className="flex-1 pb-5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-neutral-900">Clock In Recorded</span>
                                                        <span className="text-xs font-bold text-neutral-500">{clockInTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                                        <span className="text-xs font-medium text-neutral-500">Verified</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timeline: Clock Out */}
                                            <div className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-3 w-3 rounded-full bg-neutral-300 shrink-0 mt-0.5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-neutral-900">Clock Out Recorded</span>
                                                        <span className="text-xs font-bold text-neutral-500">{clockOutTime}</span>
                                                    </div>
                                                    <span className="text-xs font-medium text-neutral-500 mt-1 block">Summary available</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Section: Verification ── */}
                                    <div className="px-6 pb-5">
                                        <h4 className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-3">Verification</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Map / Location */}
                                            <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                                <div className="h-[100px] bg-[#E8F0FE] relative flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D6E4F0] to-[#E8F0FE]" />
                                                    <MapPin className="h-7 w-7 text-[#035EA9] relative z-10 drop-shadow-md" />
                                                </div>
                                                <div className="px-3 py-2">
                                                    <span className="text-xs font-semibold text-neutral-700">Jl. Raya Pasar Minggu</span>
                                                </div>
                                            </div>
                                            {/* Biometric / Selfie */}
                                            <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                                <div className="h-[100px] bg-neutral-100 relative flex items-center justify-center">
                                                    <ScanFace className="h-10 w-10 text-neutral-300" />
                                                    <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
                                                </div>
                                                <div className="px-3 py-2">
                                                    <span className="text-xs font-semibold text-neutral-700">Biometric Match</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Section: Work Information ── */}
                                    <div className="px-6 pb-8">
                                        <h4 className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-3">Work Information</h4>
                                        <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                            {/* Working Type & Active Project */}
                                            <div className="px-4 py-3 flex items-center gap-6 border-b border-neutral-100">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Working Type</span>
                                                    <Badge className="rounded-md border-none bg-[#E0E7FF] text-[#4338CA] hover:bg-[#E0E7FF] px-2 py-0.5 text-xs font-bold w-fit flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        {mode}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Active Project</span>
                                                    <Badge className="rounded-md border-none bg-[#E5F0F9] text-[#035EA9] hover:bg-[#E5F0F9] px-2 py-0.5 text-xs font-bold w-fit flex items-center gap-1">
                                                        <FolderKanban className="h-3 w-3" />
                                                        {projectName}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {/* Daily Work Summary */}
                                            <div className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <ClipboardPenLine className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span className="text-xs font-bold text-neutral-800">Daily Work Summary</span>
                                                </div>
                                                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                                                    <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                                                        {selectedAttendance.work_notes || '"Lorem ipsum dolor sit amet, consectetur adipiscing elit."'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

AttendanceIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Kehadiran', href: '/admin/attendance' }]}>
        {page}
    </AppLayout>
);
