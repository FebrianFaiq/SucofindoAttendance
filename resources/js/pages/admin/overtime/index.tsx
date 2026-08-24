import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    UserSearch,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileCheck2,
    FileX2,
    FileClock,
    CalendarX2,
    ListFilter,
    Download,
    FolderKanban,
    Building2,
    ClipboardPenLine,
    ExternalLink,
    MapPin,
    ScanFace,
    X,
    ArrowRight,
    Calendar,
    Briefcase,
    Info,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';

// Data diisi secara dinamis dari database

// ─── Helpers ───────────────────────────────────────────────────────────────

type OvertimeStatus = 'pending' | 'approved' | 'canceled';

function getStatusBadge(status: OvertimeStatus) {
    switch (status) {
        case 'pending':
            return (
                <Badge className="rounded-md border-none bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 text-[13px] font-bold">
                    Belum Di-review
                </Badge>
            );
        case 'approved':
            return (
                <Badge className="rounded-md border-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 text-[13px] font-bold">
                    Sudah Di-review
                </Badge>
            );
        case 'canceled':
            return (
                <Badge className="rounded-md border-none bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 text-[13px] font-bold">
                    Canceled
                </Badge>
            );
    }
}

function getInitials(name: string) {
    if (!name) return 'EM';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

function formatDate(dateStr: string): string {
    try {
        const date = parseISO(dateStr);
        return format(date, 'd MMM yyyy');
    } catch {
        return dateStr;
    }
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function getDrawerStatusBadge(status: OvertimeStatus) {
    switch (status) {
        case 'pending':
            return (
                <span className="px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                    Belum Di-review
                </span>
            );
        case 'approved':
            return (
                <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Sudah Di Review
                </span>
            );
        case 'canceled':
            return (
                <span className="px-3 py-1 rounded-md bg-red-50 text-red-600 text-xs font-bold border border-red-200">
                    Canceled
                </span>
            );
    }
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminOvertimeIndex({ overtimes, projects, thresholdHours }: any) {
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState<OvertimeStatus | 'all'>('all');

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedOvertime, setSelectedOvertime] = useState<any | null>(null);

    // KPI counts
    const pendingCount = overtimes.data.filter((d: any) => d.status === 'pending').length;
    const approvedCount = overtimes.data.filter((d: any) => d.status === 'approved').length;
    const canceledCount = overtimes.data.filter((d: any) => d.status === 'canceled').length;

    // Filter data
    const filteredData = overtimes.data.filter((item: any) => {
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            if (
                !item.employee.name.toLowerCase().includes(search) &&
                !item.employee.nik.toLowerCase().includes(search)
            ) {
                return false;
            }
        }
        if (projectFilter && item.project !== projectFilter) return false;
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
        return true;
    });

    const handleReset = () => {
        setSearchTerm('');
        setProjectFilter('');
        setStartDate('');
        setEndDate('');
    };

    const openDetails = (item: any) => {
        setSelectedOvertime(item);
        setIsSheetOpen(true);
    };

    return (
        <>
            <Head title="Monitoring Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F9F9FF] p-6 font-mulish">
                {/* ── Header ────────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                            Lembur Karyawan
                        </h1>
                        <p className="text-neutral-500 font-medium mt-1">
                            Monitoring dan Persetujuan Lembur Hari Ini
                        </p>
                    </div>
                </div>

                {/* ── KPI Status Cards ──────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Belum Di-review */}
                    <button
                        type="button"
                        onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
                        className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-md text-left cursor-pointer ${
                            statusFilter === 'pending'
                                ? 'border-amber-400 ring-2 ring-amber-200 bg-amber-50/30'
                                : 'border-neutral-200 hover:border-amber-300'
                        }`}
                    >
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Belum Di-review</span>
                            <span className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</span>
                            <span className="text-xs font-semibold text-amber-600 mt-2 flex items-center gap-1">
                                Perlu diperiksa →
                            </span>
                        </div>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-200/60 to-amber-300/40" />
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 relative z-10">
                            <FileClock className="h-6 w-6" />
                        </div>
                    </button>

                    {/* Sudah Di-review */}
                    <button
                        type="button"
                        onClick={() => setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved')}
                        className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-md text-left cursor-pointer ${
                            statusFilter === 'approved'
                                ? 'border-emerald-400 ring-2 ring-emerald-200 bg-emerald-50/30'
                                : 'border-neutral-200 hover:border-emerald-300'
                        }`}
                    >
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sudah Di-review</span>
                            <span className="text-3xl font-black text-emerald-600 mt-1">{approvedCount}</span>
                            <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                                Lembur hari ini →
                            </span>
                        </div>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-200/60 to-emerald-300/40" />
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 relative z-10">
                            <FileCheck2 className="h-6 w-6" />
                        </div>
                    </button>

                    {/* Canceled */}
                    <button
                        type="button"
                        onClick={() => setStatusFilter(statusFilter === 'canceled' ? 'all' : 'canceled')}
                        className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-md text-left cursor-pointer ${
                            statusFilter === 'canceled'
                                ? 'border-red-400 ring-2 ring-red-200 bg-red-50/30'
                                : 'border-neutral-200 hover:border-red-300'
                        }`}
                    >
                        <div className="flex flex-col relative z-10">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Canceled</span>
                            <span className="text-3xl font-black text-red-500 mt-1">{canceledCount}</span>
                            <span className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1">
                                Perlu dikonfirmasi ulang →
                            </span>
                        </div>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-red-200/60 to-red-300/40" />
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 relative z-10">
                            <FileX2 className="h-6 w-6" />
                        </div>
                    </button>
                </div>

                {/* ── Filter Bar ────────────────────────────── */}
                <div className="rounded-xl border border-neutral-200 bg-white px-6 py-5 shadow-sm">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-5"
                    >
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
                                    {projects.map((proj: any) => (
                                        <SelectItem key={proj.id} value={proj.name} className="font-medium">
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
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Data Karyawan Lembur</h2>
                        <div className="flex gap-2">
                            <a 
                                href={`/admin/reports/overtime-export-excel?start_date=${startDate || new Date().toISOString().split('T')[0]}&end_date=${endDate || new Date().toISOString().split('T')[0]}`} 
                                target="_blank" 
                                rel="noreferrer"
                            >
                                <Button variant="outline" className="h-9 border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 flex gap-2">
                                    <Download className="h-4 w-4" />
                                    Export Excel
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-neutral-600 whitespace-nowrap border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">No SPKL</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Karyawan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Proyek</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Tanggal</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Durasi</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            {filteredData.length > 0 && (
                                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                    {filteredData.map((item) => {
                                        const isIntern = item.employee.role === 'intern';

                                        return (
                                            <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <span className="text-xs font-bold text-[#035EA9] bg-[#E5F0F9] px-2 py-1 rounded-md">
                                                        {item.spkl_no}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 min-w-[230px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F0F9] font-bold text-[#035EA9] shrink-0">
                                                            {getInitials(item.employee.name)}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-neutral-900">{item.employee.name}</span>
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
                                                            {item.employee.division || '—'}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="rounded-md border-none bg-[#035EA9]/10 text-[#035EA9] hover:bg-[#035EA9]/20 px-2.5 py-1 text-[13px] font-bold">
                                                            {item.project ?? '—'}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-center whitespace-nowrap font-semibold text-neutral-700">
                                                    {formatDate(item.date)}
                                                </td>
                                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-bold text-neutral-900">{item.duration_hours} Jam</span>
                                                        <span className="text-[11px] text-neutral-500">{item.start_time} - {item.end_time}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    {getStatusBadge(item.status)}
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
                    {filteredData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center w-full border-t border-neutral-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F0F9] mb-4">
                                <CalendarX2 className="h-7 w-7 text-[#035EA9]" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Tidak ada data lembur</h3>
                            <p className="text-sm font-medium text-neutral-500 mx-auto max-w-[400px] text-center leading-relaxed whitespace-normal">
                                Coba sesuaikan filter atau rentang tanggal untuk menemukan data yang Anda cari.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    handleReset();
                                    setStatusFilter('all');
                                }}
                                className="mt-6 h-10 border-neutral-300 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 flex items-center justify-center gap-2 px-5"
                            >
                                <ListFilter className="h-4 w-4" />
                                Hapus Semua Filter
                            </Button>
                        </div>
                    )}

                    {/* ── Pagination Footer (static) ─────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 px-6 py-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <select
                                defaultValue="10"
                                className="h-8 rounded-md border-neutral-300 text-xs text-neutral-600 focus:ring-[#035EA9] focus:border-[#035EA9] bg-white shadow-sm"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                            <p className="text-sm font-semibold text-neutral-500">
                                Menampilkan 1 - {filteredData.length} dari {filteredData.length} data
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 cursor-not-allowed">
                                <ChevronLeft className="h-4 w-4" />
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold bg-[#035EA9] text-white">
                                1
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 cursor-not-allowed">
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Overtime Details Drawer ──────────────── */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side="right" className="w-[480px] sm:w-[520px] p-0 font-mulish overflow-y-auto border-l border-neutral-200 flex flex-col">
                        {selectedOvertime && (() => {
                            const isIntern = selectedOvertime.employee.role === 'intern';
                            const assignmentName = isIntern
                                ? (selectedOvertime.employee.division || '—')
                                : (selectedOvertime.project ?? 'Belum Ditugaskan');
                            
                            // Salary calculation
                            const dasarPerhitungan = '1/173';
                            const upahPerSesi = Math.round(selectedOvertime.gaji_pokok / 173);
                            const totalUpah = Math.round(upahPerSesi * selectedOvertime.duration_hours);

                            const durationH = Math.floor(selectedOvertime.duration_hours);
                            const durationM = Math.round((selectedOvertime.duration_hours - durationH) * 60);
                            const durationLabel = durationM > 0 ? `${durationH}j ${durationM}m` : `${durationH}j 0m`;

                            return (
                                <div className="flex flex-col flex-1">
                                    {/* ── Header ── */}
                                    <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-lg font-bold text-neutral-900">Verifikasi Pengajuan Lembur</h2>
                                                <p className="text-xs text-neutral-500 mt-0.5">Review dan verifikasi detail kerja lembur sebelum diproses.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Scrollable content ── */}
                                    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

                                        {/* ── Informasi Pengajuan ── */}
                                        <div className="rounded-xl border border-neutral-200 border-l-[3px] border-l-[#035EA9] overflow-hidden">
                                            <div className="px-5 pt-4 pb-1 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ClipboardPenLine className="h-4 w-4 text-[#035EA9]" />
                                                    <span className="text-[11px] font-extrabold text-[#035EA9] uppercase tracking-wider">Informasi Pengajuan</span>
                                                </div>
                                                {getDrawerStatusBadge(selectedOvertime.status)}
                                            </div>
                                            <div className="px-5 py-3 grid grid-cols-2 gap-y-3 gap-x-6">
                                                <div>
                                                    <span className="text-[10px] font-semibold text-neutral-400 block">No. SPKL</span>
                                                    <span className="text-sm font-bold text-neutral-900">{selectedOvertime.spkl_no}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold text-neutral-400 block">Nama Karyawan</span>
                                                    <span className="text-sm font-bold text-neutral-900">{selectedOvertime.employee.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold text-neutral-400 block">NIK</span>
                                                    <span className="text-sm font-bold text-neutral-900">{selectedOvertime.employee.nik}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold text-neutral-400 block">Tanggal</span>
                                                    <span className="text-sm font-bold text-neutral-900">{formatDate(selectedOvertime.date)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold text-neutral-400 block">Proyek</span>
                                                    <span className="text-sm font-bold text-neutral-900">{assignmentName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold text-neutral-400 block">Lokasi & Klien</span>
                                                    <span className="text-sm font-bold text-neutral-900">{selectedOvertime.location_client}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Detail Waktu ── */}
                                        <div className="rounded-xl border border-neutral-200 overflow-hidden">
                                            <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-neutral-500" />
                                                <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">Detail Waktu</span>
                                            </div>
                                            {/* Start → Duration → End */}
                                            <div className="px-5 pb-3">
                                                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-[10px] font-semibold text-neutral-400">Start Time</span>
                                                        <span className="text-2xl font-black text-neutral-900">{selectedOvertime.start_time}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <ArrowRight className="h-4 w-4 text-neutral-400" />
                                                        <span className="text-xs font-bold text-neutral-500 mt-0.5">{durationLabel}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-semibold text-neutral-400">End Time</span>
                                                        <span className="text-2xl font-black text-neutral-900">{selectedOvertime.end_time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Day & Type */}
                                            <div className="px-5 pb-4 flex items-center gap-8">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                                                        <Calendar className="h-4 w-4 text-neutral-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-semibold text-neutral-400">Day</span>
                                                        <span className="text-sm font-bold text-neutral-900">{selectedOvertime.day_name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                                                        <Briefcase className="h-4 w-4 text-neutral-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-semibold text-neutral-400">Type</span>
                                                        <span className="text-sm font-bold text-[#035EA9]">Hari Kerja</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Job Description ── */}
                                        <div className="rounded-xl border border-neutral-200 border-l-[3px] border-l-[#035EA9] overflow-hidden">
                                            <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                                                <ClipboardPenLine className="h-4 w-4 text-[#035EA9]" />
                                                <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">Job Description</span>
                                            </div>
                                            <div className="px-5 pb-4">
                                                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                                                    <p className="text-sm text-neutral-700 leading-relaxed italic">
                                                        "{selectedOvertime.work_notes}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Perhitungan Upah Lembur ── */}
                                        <div className="rounded-xl border border-neutral-200 border-l-[3px] border-l-[#035EA9] overflow-hidden">
                                            <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                                                <ClipboardPenLine className="h-4 w-4 text-[#035EA9]" />
                                                <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">Perhitungan Upah Lembur</span>
                                            </div>
                                            <div className="px-5 pb-4">
                                                <div className="divide-y divide-neutral-100">
                                                    <div className="flex items-center justify-between py-2.5">
                                                        <span className="text-sm text-neutral-600">Durasi Lembur</span>
                                                        <span className="text-sm font-semibold text-neutral-900">{selectedOvertime.duration_hours} Jam</span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2.5">
                                                        <span className="text-sm text-neutral-600">Gaji Pokok</span>
                                                        <span className="text-sm font-semibold text-neutral-900">{formatCurrency(selectedOvertime.gaji_pokok)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2.5">
                                                        <span className="text-sm text-neutral-600">Dasar Perhitungan</span>
                                                        <span className="text-sm font-semibold text-neutral-900">{dasarPerhitungan}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2.5">
                                                        <span className="text-sm text-neutral-600">Upah per Sesi</span>
                                                        <span className="text-sm font-semibold text-neutral-900">{formatCurrency(upahPerSesi)}</span>
                                                    </div>
                                                </div>
                                                {/* Total Highlight */}
                                                <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-neutral-900">Total Upah Lembur</span>
                                                    <span className="text-lg font-black text-[#DC2626]">{formatCurrency(totalUpah)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <Info className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                                    <span className="text-[11px] text-neutral-400">Nilai dihitung otomatis berdasarkan data master karyawan</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Footer Buttons ── */}
                                    <div className="border-t border-neutral-200 px-6 py-4 bg-white shrink-0">
                                        {selectedOvertime.status === 'pending' ? (
                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    className="flex-1 h-11 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Batalkan Pengajuan
                                                </Button>
                                                <Button
                                                    type="button"
                                                    className="flex-1 h-11 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Tandai Sudah Di-review
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                disabled
                                                className="w-full h-11 bg-neutral-400 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Sudah Di-review
                                            </Button>
                                        )}
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

AdminOvertimeIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Lembur', href: '/admin/overtime' }]}>
        {page}
    </AppLayout>
);
