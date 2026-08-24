import { Head, Link, router, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    Search,
    UserSearch,
    ChevronLeft,
    ChevronRight,
    LogIn,
    LogOut,
    Building2,
    FolderKanban,
    MapPin,
    ScanFace,
    ClipboardPenLine,
    CalendarX2,
    ListFilter,
    CalendarCheck,
    Calendar,
    Plus,
    Trash2,
    ExternalLink,
    Download
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';

interface AttendanceItem {
    id: number;
    employee_id: number;
    type: string;
    check_in_at: string | null;
    check_out_at: string | null;
    check_in_at_formatted: string | null;
    check_out_at_formatted: string | null;
    check_in_at_iso: string | null;
    check_out_at_iso: string | null;
    check_in_evidence: string | null;
    check_in_evidence_url: string | null;
    check_in_latitude: number | null;
    check_in_longitude: number | null;
    check_out_evidence: string | null;
    check_out_evidence_url: string | null;
    check_out_latitude: number | null;
    check_out_longitude: number | null;
    work_notes: string | null;
    employee: {
        nik: string;
        division?: string | null;
        user: {
            name: string;
            email: string;
            role?: string;
        };
        projects: {
            name: string;
            code: string;
        }[];
    };
}

interface HolidayItem {
    id: number;
    date: string;
    date_formatted: string;
    name: string;
    is_national: boolean;
    description: string | null;
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
    holidays: HolidayItem[];
    todayInfo: {
        date: string;
        date_formatted: string;
        is_holiday: boolean;
        holiday_name?: string;
        is_weekend: boolean;
    };
    kpi: {
        presentToday: number;
        clockInToday: number;
        clockOutToday: number;
        totalEmployees: number;
    };
    projects: {
        id: number;
        name: string;
        code: string;
    }[];
    filters?: {
        start_date?: string;
        end_date?: string;
        search?: string;
        project_id?: string;
        per_page?: string | number;
    };
}

export default function AttendanceIndex({
    attendances,
    holidays = [],
    projects = [],
    todayInfo,
    kpi,
    filters
}: AttendanceIndexProps) {
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [projectFilter, setProjectFilter] = useState(filters?.project_id || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceItem | null>(null);
    const [activeVerificationTab, setActiveVerificationTab] = useState<'in' | 'out'>('in');

    // Holiday dialog states
    const [isHolidayListOpen, setIsHolidayListOpen] = useState(false);
    const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState<HolidayItem | null>(null);

    // Holiday Form
    const { data: holidayData, setData: setHolidayData, post: postHoliday, processing: holidayProcessing, reset: resetHoliday, errors: holidayErrors } = useForm({
        date: '',
        name: '',
        is_national: true,
        description: '',
    });

    const handleFilter = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        router.get(
            '/admin/attendance',
            { start_date: startDate || undefined, end_date: endDate || undefined, search: searchTerm || undefined, project_id: projectFilter || undefined, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(e.target.value);
        router.get(
            '/admin/attendance',
            { start_date: startDate || undefined, end_date: endDate || undefined, search: searchTerm || undefined, project_id: projectFilter || undefined, per_page: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
        setProjectFilter('');
        router.get('/admin/attendance', {}, { preserveState: true, replace: true });
    };

    const handleCreateHoliday = (e: React.FormEvent) => {
        e.preventDefault();
        postHoliday('/admin/holidays', {
            onSuccess: () => {
                setIsAddHolidayOpen(false);
                resetHoliday();
            },
        });
    };

    const handleDeleteHoliday = () => {
        if (!holidayToDelete) {
return;
}

        router.delete(`/admin/holidays/${holidayToDelete.id}`, {
            onSuccess: () => {
                setHolidayToDelete(null);
            },
        });
    };

    const openDetails = (item: AttendanceItem) => {
        setSelectedAttendance(item);
        setActiveVerificationTab('in');
        setIsSheetOpen(true);
    };

    const getInitials = (name: string) => {
        if (!name) {
return 'EM';
}

        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    // Use server-side formatted WIB time (HH:mm) when available, fallback to client-side parsing
    const formatTime = (formattedTime: string | null | undefined, dateString: string | null) => {
        if (formattedTime) {
return formattedTime;
}

        if (!dateString) {
return '—';
}

        const date = new Date(dateString);

        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
    };

    const formatTime12 = (formattedTime: string | null | undefined, dateString: string | null) => {
        // Use server-formatted HH:mm if available
        const timeStr = formattedTime || (dateString ? null : null);

        if (!timeStr && !dateString) {
return { time: '—', period: '' };
}

        let hours: number;
        let minutes: string;

        if (timeStr) {
            const [h, m] = timeStr.split(':').map(Number);
            hours = h;
            minutes = m.toString().padStart(2, '0');
        } else {
            const date = new Date(dateString!);
            // Convert to WIB using Intl
            const wibParts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).formatToParts(date);
            hours = parseInt(wibParts.find(p => p.type === 'hour')?.value || '0');
            minutes = wibParts.find(p => p.type === 'minute')?.value || '00';
        }

        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return { time: `${displayHours.toString().padStart(2, '0')}:${minutes}`, period };
    };

    const calculateTotalHours = (checkIn: string | null, checkOut: string | null) => {
        if (!checkIn || !checkOut) {
return '—';
}

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffMs = end.getTime() - start.getTime();

        if (diffMs <= 0) {
return '—';
}

        const totalMinutes = Math.floor(diffMs / 60000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        return `${h}h ${m}m`;
    };

    const isLate = (formattedTime: string | null | undefined, dateString: string | null) => {
        if (formattedTime) {
            const [h, m] = formattedTime.split(':').map(Number);

            return h >= 8 && m > 0;
        }

        if (!dateString) {
return false;
}

        const date = new Date(dateString);

        return date.getHours() >= 8 && date.getMinutes() > 0;
    };

    const exportUrl = `/admin/reports/export?${new URLSearchParams({
        ...(startDate ? { start_date: startDate } : {}),
        ...(endDate ? { end_date: endDate } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(projectFilter ? { project_id: projectFilter } : {}),
    }).toString()}`;

    // Ekstrak bulan dan tahun dari startDate jika ada, jika tidak gunakan bulan/tahun saat ini
    const exportMonth = startDate ? String(parseISO(startDate).getMonth() + 1) : String(new Date().getMonth() + 1);
    const exportYear = startDate ? String(parseISO(startDate).getFullYear()) : String(new Date().getFullYear());

    const excelExportKaryawanUrl = `/admin/reports/export-excel?${new URLSearchParams({
        role: 'employee',
        month: exportMonth,
        year: exportYear,
    }).toString()}`;

    const excelExportMagangUrl = `/admin/reports/export-excel?${new URLSearchParams({
        role: 'intern',
        month: exportMonth,
        year: exportYear,
    }).toString()}`;

    return (
        <>
            <Head title="Monitoring Kehadiran" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F9F9FF] p-6 font-mulish">

                {/* ── Header ────────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                            Monitoring Kehadiran
                        </h1>
                        <p className="text-neutral-500 font-medium mt-1">
                            Pantau presensi harian karyawan & mahasiswa magang serta kelola master hari libur kerja.
                        </p>
                    </div>

                    {/* Action Buttons (Daftar Hari Libur & Tambah Hari Libur) */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsHolidayListOpen(true)}
                            className="border-neutral-300 bg-white hover:bg-neutral-50 font-bold h-11 px-4 text-neutral-700 flex items-center gap-2 rounded-xl text-xs shadow-sm"
                        >
                            <Calendar className="h-4 w-4 text-[#035EA9]" />
                            Daftar Hari Libur ({holidays.length})
                        </Button>

                        <Button
                            onClick={() => setIsAddHolidayOpen(true)}
                            className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11 px-5 flex items-center gap-2 shadow-sm rounded-xl text-xs"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Hari Libur
                        </Button>
                    </div>
                </div>

                {/* ── KPI Summary Cards ──────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Hadir Hari Ini */}
                    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-5 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-l-[#035EA9] hover:border-y-[#035EA9]/30 hover:border-r-[#035EA9]/30 hover:bg-[#F0F5FA]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#035EA9] transition-colors group-hover:bg-[#D6E4F0]">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hadir Hari Ini</span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-black text-neutral-900">{kpi.presentToday}</span>
                                <span className="text-xs text-neutral-500 font-semibold">/ {kpi.totalEmployees} Pegawai</span>
                            </div>
                        </div>
                    </div>

                    {/* Clock In */}
                    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-5 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-l-[#22C55E] hover:border-y-[#22C55E]/30 hover:border-r-[#22C55E]/30 hover:bg-[#F0FDF4]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-[#BBF7D0]">
                            <LogIn className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Clock In</span>
                            <span className="text-2xl font-black text-neutral-900 mt-0.5">{kpi.clockInToday} <span className="text-xs text-neutral-500 font-normal">Orang</span></span>
                        </div>
                    </div>

                    {/* Clock Out */}
                    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-5 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-l-[#EF4444] hover:border-y-[#EF4444]/30 hover:border-r-[#EF4444]/30 hover:bg-[#FEF2F2]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#035EA9] transition-colors group-hover:bg-[#FCD3D3] group-hover:text-[#EF4444]">
                            <LogOut className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Clock Out</span>
                            <span className="text-2xl font-black text-neutral-900 mt-0.5">{kpi.clockOutToday} <span className="text-xs text-neutral-500 font-normal">Orang</span></span>
                        </div>
                    </div>

                    {/* Status Kalender Hari Ini */}
                    <div className={`group relative overflow-hidden rounded-2xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-5 shadow-sm flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${todayInfo.is_holiday || todayInfo.is_weekend ? 'hover:border-l-[#EF4444] hover:border-y-[#EF4444]/30 hover:border-r-[#EF4444]/30 hover:bg-[#FEF2F2]' : 'hover:border-l-[#22C55E] hover:border-y-[#22C55E]/30 hover:border-r-[#22C55E]/30 hover:bg-[#F0FDF4]'}`}>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${todayInfo.is_holiday || todayInfo.is_weekend
                                ? 'bg-amber-50 text-amber-600 group-hover:bg-[#FCD3D3] group-hover:text-[#EF4444]'
                                : 'bg-emerald-50 text-emerald-600 group-hover:bg-[#BBF7D0]'
                            }`}>
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Status Hari Ini</span>
                            {todayInfo.is_holiday ? (
                                <span className="text-sm font-bold text-red-600 truncate max-w-[170px]" title={todayInfo.holiday_name}>
                                    Libur: {todayInfo.holiday_name}
                                </span>
                            ) : todayInfo.is_weekend ? (
                                <span className="text-sm font-bold text-amber-600">Akhir Pekan (Weekend)</span>
                            ) : (
                                <span className="text-sm font-bold text-emerald-600">Hari Kerja Normal</span>
                            )}
                            <span className="text-[11px] text-neutral-500 font-medium">{todayInfo.date_formatted}</span>
                        </div>
                    </div>
                </div>

                {/* ── Filter Bar ────────────────────────────── */}
                <div className="rounded-xl border border-neutral-200 bg-white px-6 py-5 shadow-sm">
                    <form onSubmit={handleFilter} className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-5">
                        {/* Karyawan */}
                        <div className="flex-1 min-w-0 lg:max-w-[300px]">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">Karyawan</label>
                            <div className="relative">
                                <UserSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari Nama atau NIK..."
                                    className="pl-10 h-[42px] w-full rounded-lg border border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9] text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Proyek */}
                        <div className="w-full lg:w-[220px] shrink-0">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">Proyek</label>
                            <Select 
                                value={projectFilter || 'all'} 
                                onValueChange={(value) => setProjectFilter(value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="h-[42px] w-full rounded-lg border border-neutral-300 bg-white shadow-sm focus:ring-[#035EA9] text-sm font-medium text-neutral-700 px-3 data-[size=default]:h-[42px] data-[state=open]:ring-1 data-[state=open]:ring-[#035EA9]">
                                    <SelectValue placeholder="Semua Proyek" />
                                </SelectTrigger>
                                <SelectContent className="font-mulish">
                                    <SelectItem value="all" className="font-medium">Semua Proyek</SelectItem>
                                    {projects.map((proj) => (
                                        <SelectItem key={proj.id} value={proj.id.toString()} className="font-medium">
                                            {proj.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Start Date */}
                        <div className="w-full lg:w-[200px] shrink-0">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">Start Date</label>
                            <DatePicker
                                date={startDate ? parseISO(startDate) : undefined}
                                setDate={(d) => setStartDate(d ? format(d, 'yyyy-MM-dd') : '')}
                                placeholder="Pilih Start Date"
                                className="w-full h-[42px] rounded-lg border border-neutral-300 bg-white shadow-sm font-medium text-neutral-600 px-3 data-[size=default]:h-[42px]"
                            />
                        </div>

                        {/* End Date */}
                        <div className="w-full lg:w-[200px] shrink-0">
                            <label className="mb-1.5 block text-sm font-bold text-neutral-800">End Date</label>
                            <DatePicker
                                date={endDate ? parseISO(endDate) : undefined}
                                setDate={(d) => setEndDate(d ? format(d, 'yyyy-MM-dd') : '')}
                                placeholder="Pilih End Date"
                                className="w-full h-[42px] rounded-lg border border-neutral-300 bg-white shadow-sm font-medium text-neutral-600 px-3 data-[size=default]:h-[42px]"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-end gap-3 shrink-0">
                            <Button
                                type="button"
                                onClick={handleReset}
                                variant="outline"
                                className="h-[42px] min-w-[90px] rounded-lg border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 text-center text-xs leading-[1.3] px-4 py-1"
                            >
                                Reset Filter
                            </Button>
                            <Button
                                type="submit"
                                className="h-[42px] min-w-[90px] rounded-lg bg-[#035EA9] font-bold text-white shadow-sm hover:bg-[#035EA9]/90 text-center text-xs leading-[1.3] px-4 py-1"
                            >
                                Terapkan Filter
                            </Button>
                        </div>
                    </form>
                </div>

                {/* ── Table Container ───────────────────────────────── */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Data Kehadiran</h2>
                        <div className="flex gap-2">
                            <a
                                href={exportUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button variant="outline" className="h-9 border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 flex gap-2">
                                    <Download className="h-4 w-4" />
                                    Export CSV
                                </Button>
                            </a>
                            <a
                                href={excelExportKaryawanUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button className="h-9 bg-emerald-600 font-bold text-white shadow-sm hover:bg-emerald-700 flex gap-2">
                                    <Download className="h-4 w-4" />
                                    Excel Karyawan
                                </Button>
                            </a>
                            <a
                                href={excelExportMagangUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button className="h-9 bg-indigo-600 font-bold text-white shadow-sm hover:bg-indigo-700 flex gap-2">
                                    <Download className="h-4 w-4" />
                                    Excel Magang
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-neutral-600 whitespace-nowrap border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">Karyawan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Proyek / Bidang</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Clock In</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Clock Out</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Mode</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            {attendances.data.length > 0 && (
                                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                    {attendances.data.map((item) => {
                                        const clockIn = formatTime(item.check_in_at_formatted, item.check_in_at);
                                        const clockOut = formatTime(item.check_out_at_formatted, item.check_out_at);
                                        const late = isLate(item.check_in_at_formatted, item.check_in_at);
                                        const isIntern = item.employee?.user?.role === 'intern';

                                        return (
                                            <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-3 min-w-[250px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F0F9] font-bold text-[#035EA9] shrink-0">
                                                            {getInitials(item.employee?.user?.name)}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-neutral-900">{item.employee?.user?.name}</span>
                                                            <span className="text-[11px] font-bold">
                                                                {isIntern ? (
                                                                    <span className="text-[#00A099]">Mahasiswa Magang</span>
                                                                ) : (
                                                                    <span className="text-[#035EA9]">Karyawan PTT</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 font-semibold text-neutral-600">
                                                    {isIntern ? (
                                                        <Badge variant="secondary" className="rounded-md border-none bg-[#00A099]/10 text-[#00A099] hover:bg-[#00A099]/20 px-2.5 py-1 text-[13px] font-bold">
                                                            {item.employee?.division || '—'}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="rounded-md border-none bg-[#035EA9]/10 text-[#035EA9] hover:bg-[#035EA9]/20 px-2.5 py-1 text-[13px] font-bold">
                                                            {item.employee?.projects?.[0]?.name ?? '—'}
                                                        </Badge>
                                                    )}
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <select
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="h-8 rounded-md border-neutral-300 text-xs text-neutral-600 focus:ring-[#035EA9] focus:border-[#035EA9] bg-white shadow-sm"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <p className="text-sm font-semibold text-neutral-500">
                                Menampilkan {attendances.from || 0} - {attendances.to || 0} dari {attendances.total} data
                            </p>
                        </div>
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
                                            className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold transition-colors ${link.active
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
                            const clockIn12 = formatTime12(selectedAttendance.check_in_at_formatted, selectedAttendance.check_in_at);
                            const clockOut12 = formatTime12(selectedAttendance.check_out_at_formatted, selectedAttendance.check_out_at);
                            const totalHours = calculateTotalHours(selectedAttendance.check_in_at_iso || selectedAttendance.check_in_at, selectedAttendance.check_out_at_iso || selectedAttendance.check_out_at);
                            const employeeName = selectedAttendance.employee?.user?.name ?? 'Karyawan';
                            const nik = selectedAttendance.employee?.nik ?? '—';
                            const isIntern = selectedAttendance.employee?.user?.role === 'intern';
                            const assignmentName = isIntern
                                ? (selectedAttendance.employee?.division || '—')
                                : (selectedAttendance.employee?.projects?.[0]?.name ?? 'Belum Ditugaskan');
                            const mode = selectedAttendance.type?.toUpperCase() || 'WFO';
                            const isPresent = !!selectedAttendance.check_in_at;
                            const clockInTime = formatTime(selectedAttendance.check_in_at_formatted, selectedAttendance.check_in_at);
                            const clockOutTime = formatTime(selectedAttendance.check_out_at_formatted, selectedAttendance.check_out_at);

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
                                                NIK: {nik} · {assignmentName}
                                            </p>
                                        </div>
                                        <Badge className={`shrink-0 rounded-full border-none px-3 py-1 text-[11px] font-bold ${isPresent
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
                                            <div className="flex gap-3 relative">
                                                <div className="flex flex-col items-center relative z-10">
                                                    <div className={`h-3 w-3 rounded-full shrink-0 mt-0.5 transition-colors ${activeVerificationTab === 'in' ? 'bg-[#035EA9] ring-2 ring-[#035EA9]/20' : 'bg-neutral-300'}`} />
                                                    <div className="w-px flex-1 bg-neutral-200" />
                                                </div>
                                                <div 
                                                    onClick={() => setActiveVerificationTab('in')}
                                                    className={`flex-1 pb-5 cursor-pointer rounded-lg -mt-1.5 p-1.5 px-3 transition-colors ${activeVerificationTab === 'in' ? 'bg-[#EEF4FC]' : 'hover:bg-neutral-50'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-bold ${activeVerificationTab === 'in' ? 'text-[#035EA9]' : 'text-neutral-900'}`}>Clock In Recorded</span>
                                                        <span className="text-xs font-bold text-neutral-500">{clockInTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                                        <span className="text-xs font-medium text-neutral-500">Verified</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timeline: Clock Out */}
                                            <div className="flex gap-3 relative">
                                                <div className="flex flex-col items-center relative z-10">
                                                    <div className={`h-3 w-3 rounded-full shrink-0 mt-0.5 transition-colors ${activeVerificationTab === 'out' ? 'bg-[#035EA9] ring-2 ring-[#035EA9]/20' : 'bg-neutral-300'}`} />
                                                </div>
                                                <div 
                                                    onClick={() => selectedAttendance.check_out_at && setActiveVerificationTab('out')}
                                                    className={`flex-1 rounded-lg -mt-1.5 p-1.5 px-3 transition-colors ${selectedAttendance.check_out_at ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${activeVerificationTab === 'out' ? 'bg-[#EEF4FC]' : (selectedAttendance.check_out_at ? 'hover:bg-neutral-50' : '')}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-bold ${activeVerificationTab === 'out' ? 'text-[#035EA9]' : 'text-neutral-900'}`}>Clock Out Recorded</span>
                                                        <span className="text-xs font-bold text-neutral-500">{clockOutTime}</span>
                                                    </div>
                                                    <span className="text-xs font-medium text-neutral-500 mt-1 block">
                                                        {selectedAttendance.check_out_at ? 'Summary available' : 'Belum Clock Out'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Section: Verification ── */}
                                    <div className="px-6 pb-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
                                                Verification ({activeVerificationTab === 'in' ? 'Clock In' : 'Clock Out'})
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Map / Location */}
                                            <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                                <div className="h-[100px] bg-[#E8F0FE] relative flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D6E4F0] to-[#E8F0FE]" />
                                                    <MapPin className="h-7 w-7 text-[#035EA9] relative z-10 drop-shadow-md" />
                                                </div>
                                                <div className="px-3 py-2">
                                                    {(activeVerificationTab === 'in' ? selectedAttendance.check_in_latitude : selectedAttendance.check_out_latitude) && (activeVerificationTab === 'in' ? selectedAttendance.check_in_longitude : selectedAttendance.check_out_longitude) ? (
                                                        <a
                                                            href={`https://www.google.com/maps?q=${activeVerificationTab === 'in' ? selectedAttendance.check_in_latitude : selectedAttendance.check_out_latitude},${activeVerificationTab === 'in' ? selectedAttendance.check_in_longitude : selectedAttendance.check_out_longitude}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs font-semibold text-[#035EA9] hover:underline flex items-center gap-1"
                                                        >
                                                            <span>Buka Google Maps</span>
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs font-semibold text-neutral-500">Koordinat tidak tersedia</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Biometric / Selfie */}
                                            <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                                <div className="h-[100px] bg-neutral-100 relative flex items-center justify-center">
                                                    {((activeVerificationTab === 'in' ? selectedAttendance.check_in_evidence_url : selectedAttendance.check_out_evidence_url) || (activeVerificationTab === 'in' ? selectedAttendance.check_in_evidence : selectedAttendance.check_out_evidence)) ? (
                                                        <img
                                                            src={(activeVerificationTab === 'in' ? selectedAttendance.check_in_evidence_url : selectedAttendance.check_out_evidence_url) || `/storage/${activeVerificationTab === 'in' ? selectedAttendance.check_in_evidence : selectedAttendance.check_out_evidence}`}
                                                            alt={`Foto ${activeVerificationTab === 'in' ? 'Clock In' : 'Clock Out'}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <ScanFace className="h-10 w-10 text-neutral-300" />
                                                    )}
                                                    <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
                                                </div>
                                                <div className="px-3 py-2">
                                                    <span className="text-xs font-semibold text-neutral-700">Foto Presensi</span>
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
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                                        {isIntern ? 'Bidang' : 'Active Project'}
                                                    </span>
                                                    <Badge className="rounded-md border-none bg-[#E5F0F9] text-[#035EA9] hover:bg-[#E5F0F9] px-2 py-0.5 text-xs font-bold w-fit flex items-center gap-1">
                                                        <FolderKanban className="h-3 w-3" />
                                                        {assignmentName}
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
                                                        {selectedAttendance.work_notes || 'Tidak ada catatan kerja.'}
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

                {/* ── Dialog 1: Modal Daftar Hari Libur (Full List) ──── */}
                <Dialog open={isHolidayListOpen} onOpenChange={setIsHolidayListOpen}>
                    <DialogContent className="sm:max-w-[720px] p-6 font-mulish max-h-[85vh] flex flex-col">
                        <DialogHeader className="border-b border-neutral-200 pb-3">
                            <div className="flex items-center justify-between pr-6">
                                <div>
                                    <DialogTitle className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-[#035EA9]" />
                                        Daftar Hari Libur ({holidays.length})
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-neutral-500 mt-1">
                                        Daftar hari libur nasional (SKB 3 Menteri) dan libur khusus perusahaan tahun 2026.
                                    </DialogDescription>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setIsHolidayListOpen(false);
                                        setIsAddHolidayOpen(true);
                                    }}
                                    className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold text-xs h-9 px-3 flex items-center gap-1.5 rounded-lg"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah Libur
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto mt-3">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#F8FAFC] border-b border-neutral-200 text-neutral-500 font-bold uppercase sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2.5">Tanggal</th>
                                        <th className="px-4 py-2.5">Nama Hari Libur</th>
                                        <th className="px-4 py-2.5">Kategori</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {holidays.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                                                Belum ada data hari libur terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        holidays.map((h) => (
                                            <tr key={h.id} className="hover:bg-neutral-50/60">
                                                <td className="px-4 py-3 font-bold text-[#035EA9] whitespace-nowrap">
                                                    {h.date_formatted}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-neutral-900">
                                                    {h.name}
                                                    {h.description && (
                                                        <p className="text-[11px] text-neutral-400 font-normal mt-0.5">{h.description}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {h.is_national ? (
                                                        <Badge className="bg-blue-50 text-blue-700 border-none font-bold text-[10px]">
                                                            Libur Nasional
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-50 text-amber-700 border-none font-bold text-[10px]">
                                                            Libur Perusahaan
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsHolidayListOpen(false);
                                                            setHolidayToDelete(h);
                                                        }}
                                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                        title="Hapus Hari Libur"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <DialogFooter className="border-t border-neutral-200 pt-3">
                            <DialogClose asChild>
                                <Button variant="outline" className="text-xs font-bold h-9">
                                    Tutup
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Dialog 2: Modal Tambah Hari Libur ──────────────── */}
                <Dialog open={isAddHolidayOpen} onOpenChange={setIsAddHolidayOpen}>
                    <DialogContent className="sm:max-w-[480px] p-6 font-mulish">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-[#1E293B]">
                                Tambah Hari Libur Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500">
                                Tambahkan tanggal libur nasional atau libur khusus perusahaan ke kalender sistem absensi.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreateHoliday} className="flex flex-col gap-4 mt-2">
                            {/* Tanggal */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-neutral-700">
                                    Tanggal Libur <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    date={holidayData.date ? parseISO(holidayData.date) : undefined}
                                    setDate={(d) => setHolidayData('date', d ? format(d, 'yyyy-MM-dd') : '')}
                                    placeholder="Pilih Tanggal Libur"
                                    className="w-full h-10 border-neutral-200 text-xs font-semibold px-3"
                                />
                                {holidayErrors.date && <p className="text-xs text-red-500 font-semibold">{holidayErrors.date}</p>}
                            </div>

                            {/* Nama Libur */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-neutral-700">
                                    Nama Hari Libur <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={holidayData.name}
                                    onChange={(e) => setHolidayData('name', e.target.value)}
                                    placeholder="Contoh: HUT SUCOFINDO ke-70"
                                    required
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-xs font-semibold"
                                />
                                {holidayErrors.name && <p className="text-xs text-red-500 font-semibold">{holidayErrors.name}</p>}
                            </div>

                            {/* Kategori */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-neutral-700">Kategori</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setHolidayData('is_national', true)}
                                        className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${holidayData.is_national
                                                ? 'bg-[#E5F0F9] border-[#035EA9] text-[#035EA9]'
                                                : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Libur Nasional
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHolidayData('is_national', false)}
                                        className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${!holidayData.is_national
                                                ? 'bg-amber-50 border-amber-500 text-amber-700'
                                                : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Libur Perusahaan
                                    </button>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-neutral-700">Keterangan (Opsional)</label>
                                <Input
                                    value={holidayData.description}
                                    onChange={(e) => setHolidayData('description', e.target.value)}
                                    placeholder="Contoh: Libur khusus cuti bersama internal kantor"
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-xs font-semibold"
                                />
                            </div>

                            <DialogFooter className="flex justify-end gap-2 mt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className="h-10 text-xs font-bold">
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={holidayProcessing}
                                    className="h-10 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 text-white font-bold text-xs"
                                >
                                    {holidayProcessing ? 'Menyimpan...' : 'Simpan Hari Libur'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* ── Dialog 3: Konfirmasi Hapus Hari Libur ──────────── */}
                <Dialog open={!!holidayToDelete} onOpenChange={(open) => !open && setHolidayToDelete(null)}>
                    <DialogContent className="sm:max-w-[400px] p-6 font-mulish text-center border-none">
                        <DialogHeader className="flex flex-col items-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-3">
                                <Trash2 className="h-7 w-7 text-red-600" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-neutral-900">Hapus Hari Libur?</DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500 mt-2 text-center leading-relaxed">
                                Apakah Anda yakin ingin menghapus hari libur <b>"{holidayToDelete?.name}"</b> ({holidayToDelete?.date})? Karyawan akan dapat melakukan absensi pada tanggal tersebut.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-col gap-2 mt-4">
                            <Button
                                onClick={handleDeleteHoliday}
                                className="w-full bg-[#C81E1E] hover:bg-[#B91C1C] text-white font-bold h-10 text-xs"
                            >
                                Ya, Hapus Hari Libur
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full border-neutral-300 font-bold text-neutral-700 h-10 text-xs">
                                    Batal
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    );
}

AttendanceIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Kehadiran', href: '/admin/attendance' }]}>
        {page}
    </AppLayout>
);
