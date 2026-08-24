import { Head, router, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    CalendarX2,
    Calendar,
    Plus,
    Trash2,
    Pencil,
    Filter,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage } from '@/components/flash-message';

interface HolidayItem {
    id: number;
    date: string;
    date_formatted: string;
    name: string;
    is_national: boolean;
    description: string | null;
}

interface HolidayIndexProps {
    holidays: HolidayItem[];
    selectedYear: number;
    availableYears: number[];
}

export default function HolidayIndex({ holidays, selectedYear, availableYears }: HolidayIndexProps) {
    const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
    const [isEditHolidayOpen, setIsEditHolidayOpen] = useState(false);
    const [holidayToEdit, setHolidayToEdit] = useState<HolidayItem | null>(null);
    const [holidayToDelete, setHolidayToDelete] = useState<HolidayItem | null>(null);

    // Form Tambah
    const { data: holidayData, setData: setHolidayData, post: postHoliday, processing: holidayProcessing, reset: resetHoliday, errors: holidayErrors } = useForm({
        date: '',
        name: '',
        is_national: true,
        description: '',
    });

    // Form Edit
    const { data: editData, setData: setEditData, put: putHoliday, processing: editProcessing, reset: resetEdit, errors: editErrors } = useForm({
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

    const openEditModal = (h: HolidayItem) => {
        setHolidayToEdit(h);
        setEditData({
            date: h.date,
            name: h.name,
            is_national: h.is_national,
            description: h.description || '',
        });
        setIsEditHolidayOpen(true);
    };

    const handleEditHoliday = (e: React.FormEvent) => {
        e.preventDefault();
        if (!holidayToEdit) return;

        putHoliday(`/admin/holidays/${holidayToEdit.id}`, {
            onSuccess: () => {
                setIsEditHolidayOpen(false);
                setHolidayToEdit(null);
                resetEdit();
            },
        });
    };

    const handleDeleteHoliday = () => {
        if (!holidayToDelete) return;

        router.delete(`/admin/holidays/${holidayToDelete.id}`, {
            onSuccess: () => {
                setHolidayToDelete(null);
                setIsEditHolidayOpen(false);
            },
        });
    };

    const handleYearFilter = (val: string) => {
        router.get('/admin/holidays', { year: val }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Manajemen Hari Libur" />
            <FlashMessage />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F9F9FF] p-6 font-mulish">
                {/* ── Header ────────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                            Manajemen Hari Libur
                        </h1>
                        <p className="text-neutral-500 font-medium mt-1">
                            Kelola daftar hari libur nasional (SKB 3 Menteri) dan libur khusus perusahaan yang berlaku.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsAddHolidayOpen(true)}
                            className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11 px-5 flex items-center gap-2 shadow-sm rounded-xl text-xs"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Hari Libur
                        </Button>
                    </div>
                </div>

                {/* ── Filter Bar ────────────────────────────── */}
                <div className="rounded-xl border border-neutral-200 bg-white px-6 py-5 shadow-sm flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-neutral-500" />
                        <label className="text-sm font-bold text-neutral-800">Filter Tahun:</label>
                    </div>
                    <Select
                        value={String(selectedYear)}
                        onValueChange={handleYearFilter}
                    >
                        <SelectTrigger className="w-[150px] h-10 bg-white border-neutral-300 focus:ring-[#035EA9] focus:border-[#035EA9] font-medium text-neutral-700 shadow-sm">
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={String(year)}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* ── Table Container ───────────────────────────────── */}
                <div className="flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Daftar Hari Libur ({selectedYear})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-neutral-600 whitespace-nowrap border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">Tanggal</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Nama Hari Libur</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Kategori</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                {holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F0F9] mb-4">
                                                    <CalendarX2 className="h-7 w-7 text-[#035EA9]" />
                                                </div>
                                                <h3 className="text-lg font-bold text-neutral-900 mb-1">Tidak ada hari libur</h3>
                                                <p className="text-sm font-medium text-neutral-500">
                                                    Belum ada data hari libur terdaftar pada tahun {selectedYear}.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((h) => (
                                        <tr key={h.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#035EA9] whitespace-nowrap">
                                                {h.date_formatted}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-neutral-900">{h.name}</p>
                                                {h.description && (
                                                    <p className="text-xs text-neutral-500 font-medium mt-1">{h.description}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {h.is_national ? (
                                                    <Badge className="rounded-md border-none bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 text-[13px] font-bold">
                                                        Libur Nasional
                                                    </Badge>
                                                ) : (
                                                    <Badge className="rounded-md border-none bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 text-[13px] font-bold">
                                                        Libur Perusahaan
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(h)}
                                                    className="inline-flex items-center justify-center p-2 rounded-lg text-[#035EA9] hover:bg-[#E5F0F9] transition-colors"
                                                    title="Edit Hari Libur"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Dialog: Modal Tambah Hari Libur ──────────────── */}
                <Dialog open={isAddHolidayOpen} onOpenChange={setIsAddHolidayOpen}>
                    <DialogContent className="sm:max-w-[480px] p-6 font-mulish">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-[#1E293B]">
                                Tambah Hari Libur Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500">
                                Tambahkan tanggal libur nasional atau libur khusus perusahaan ke sistem absensi.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreateHoliday} className="flex flex-col gap-4 mt-2">
                            {/* Tanggal */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-neutral-700">
                                    Tanggal Libur <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    date={holidayData.date ? parseISO(holidayData.date) : undefined}
                                    setDate={(d) => setHolidayData('date', d ? format(d, 'yyyy-MM-dd') : '')}
                                    placeholder="Pilih Tanggal Libur"
                                    className="w-full h-10 border-neutral-200 text-sm font-medium px-3"
                                />
                                {holidayErrors.date && <p className="text-xs text-red-500 font-semibold">{holidayErrors.date}</p>}
                            </div>

                            {/* Nama Libur */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-neutral-700">
                                    Nama Hari Libur <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={holidayData.name}
                                    onChange={(e) => setHolidayData('name', e.target.value)}
                                    placeholder="Contoh: HUT SUCOFINDO ke-70"
                                    required
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-sm font-medium"
                                />
                                {holidayErrors.name && <p className="text-xs text-red-500 font-semibold">{holidayErrors.name}</p>}
                            </div>

                            {/* Kategori */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-neutral-700">Kategori</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setHolidayData('is_national', true)}
                                        className={`p-2.5 rounded-lg border text-sm font-bold text-center transition-all ${holidayData.is_national
                                                ? 'bg-[#E5F0F9] border-[#035EA9] text-[#035EA9]'
                                                : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Libur Nasional
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHolidayData('is_national', false)}
                                        className={`p-2.5 rounded-lg border text-sm font-bold text-center transition-all ${!holidayData.is_national
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
                                <label className="text-sm font-bold text-neutral-700">Keterangan (Opsional)</label>
                                <Input
                                    value={holidayData.description}
                                    onChange={(e) => setHolidayData('description', e.target.value)}
                                    placeholder="Contoh: Libur khusus cuti bersama internal kantor"
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-sm font-medium"
                                />
                            </div>

                            <DialogFooter className="flex justify-end gap-2 mt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className="h-10 text-sm font-bold">
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={holidayProcessing}
                                    className="h-10 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 text-white font-bold text-sm"
                                >
                                    {holidayProcessing ? 'Menyimpan...' : 'Simpan Hari Libur'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* ── Dialog: Konfirmasi Hapus Hari Libur ──────────── */}
                <Dialog open={!!holidayToDelete} onOpenChange={(open) => !open && setHolidayToDelete(null)}>
                    <DialogContent className="sm:max-w-[400px] p-6 font-mulish text-center border-none">
                        <DialogHeader className="flex flex-col items-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-3">
                                <Trash2 className="h-7 w-7 text-red-600" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-neutral-900">Hapus Hari Libur?</DialogTitle>
                            <DialogDescription className="text-sm text-neutral-500 mt-2 text-center leading-relaxed">
                                Apakah Anda yakin ingin menghapus hari libur <b>"{holidayToDelete?.name}"</b> ({holidayToDelete?.date_formatted})?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-col gap-2 mt-4">
                            <Button
                                onClick={handleDeleteHoliday}
                                className="w-full bg-[#C81E1E] hover:bg-[#B91C1C] text-white font-bold h-10 text-sm"
                            >
                                Ya, Hapus Hari Libur
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full border-neutral-300 font-bold text-neutral-700 h-10 text-sm">
                                    Batal
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Dialog: Modal Edit Hari Libur ──────────────── */}
                <Dialog open={isEditHolidayOpen} onOpenChange={setIsEditHolidayOpen}>
                    <DialogContent className="sm:max-w-[480px] p-6 font-mulish">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-[#1E293B]">
                                Edit Hari Libur
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500">
                                Ubah data hari libur nasional atau libur khusus perusahaan.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleEditHoliday} className="flex flex-col gap-4 mt-2">
                            {/* Tanggal */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-neutral-700">
                                    Tanggal Libur <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    date={editData.date ? parseISO(editData.date) : undefined}
                                    setDate={(d) => setEditData('date', d ? format(d, 'yyyy-MM-dd') : '')}
                                    placeholder="Pilih Tanggal Libur"
                                    className="w-full h-10 border-neutral-200 text-sm font-medium px-3"
                                />
                                {editErrors.date && <p className="text-xs text-red-500 font-semibold">{editErrors.date}</p>}
                            </div>

                            {/* Nama Libur */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-neutral-700">
                                    Nama Hari Libur <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    placeholder="Contoh: HUT SUCOFINDO ke-70"
                                    required
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-sm font-medium"
                                />
                                {editErrors.name && <p className="text-xs text-red-500 font-semibold">{editErrors.name}</p>}
                            </div>

                            {/* Kategori */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-neutral-700">Kategori</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditData('is_national', true)}
                                        className={`p-2.5 rounded-lg border text-sm font-bold text-center transition-all ${editData.is_national
                                                ? 'bg-[#E5F0F9] border-[#035EA9] text-[#035EA9]'
                                                : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Libur Nasional
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditData('is_national', false)}
                                        className={`p-2.5 rounded-lg border text-sm font-bold text-center transition-all ${!editData.is_national
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
                                <label className="text-sm font-bold text-neutral-700">Keterangan (Opsional)</label>
                                <Input
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    placeholder="Contoh: Libur khusus cuti bersama internal kantor"
                                    className="h-10 bg-[#F8FAFC] border-neutral-200 text-sm font-medium"
                                />
                            </div>

                            <DialogFooter className="flex items-center justify-between gap-2 mt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setHolidayToDelete(holidayToEdit)}
                                    className="h-10 text-sm font-bold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </Button>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" className="h-10 text-sm font-bold">
                                            Batal
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="h-10 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 text-white font-bold text-sm"
                                    >
                                        {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    );
}

HolidayIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Hari Libur', href: '/admin/holidays' }]}>
        {page}
    </AppLayout>
);
