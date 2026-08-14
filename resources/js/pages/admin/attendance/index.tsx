import { Head, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { 
    CalendarCheck, 
    Calendar, 
    Plus, 
    Trash2, 
    LogIn,
    LogOut,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface HolidayItem {
    id: number;
    date: string;
    date_formatted: string;
    name: string;
    is_national: boolean;
    description: string | null;
}

interface AttendanceIndexProps {
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
}

export default function AttendanceIndex({
    holidays = [],
    todayInfo,
    kpi,
}: AttendanceIndexProps) {
    // Dialog states
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
        if (!holidayToDelete) return;
        router.delete(`/admin/holidays/${holidayToDelete.id}`, {
            onSuccess: () => {
                setHolidayToDelete(null);
            },
        });
    };

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
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#035EA9]">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hadir Hari Ini</span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-black text-neutral-900">{kpi.presentToday}</span>
                                <span className="text-xs text-neutral-500 font-semibold">/ {kpi.totalEmployees} Pegawai</span>
                            </div>
                        </div>
                    </div>

                    {/* Clock In */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <LogIn className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Clock In</span>
                            <span className="text-2xl font-black text-neutral-900 mt-0.5">{kpi.clockInToday} <span className="text-xs text-neutral-500 font-normal">Orang</span></span>
                        </div>
                    </div>

                    {/* Clock Out */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#035EA9]">
                            <LogOut className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Clock Out</span>
                            <span className="text-2xl font-black text-neutral-900 mt-0.5">{kpi.clockOutToday} <span className="text-xs text-neutral-500 font-normal">Orang</span></span>
                        </div>
                    </div>

                    {/* Status Kalender Hari Ini */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            todayInfo.is_holiday || todayInfo.is_weekend
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600'
                        }`}>
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
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
                                <Input 
                                    type="date"
                                    value={holidayData.date}
                                    onChange={(e) => setHolidayData('date', e.target.value)}
                                    required
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-xs font-semibold"
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
                                        className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${
                                            holidayData.is_national
                                                ? 'bg-[#E5F0F9] border-[#035EA9] text-[#035EA9]'
                                                : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                    >
                                        Libur Nasional
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHolidayData('is_national', false)}
                                        className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${
                                            !holidayData.is_national
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
    <AppLayout breadcrumbs={[
        { title: 'Absensi', href: '/admin/attendance' }
    ]}>
        {page}
    </AppLayout>
);
