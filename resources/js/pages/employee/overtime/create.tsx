import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { parseISO, format } from 'date-fns';
import { Clock } from 'lucide-react';

export default function OvertimeCreate() {
    const [date, setDate] = useState('');
    const [startHour, setStartHour] = useState('');
    const [startMinute, setStartMinute] = useState('');
    const [endHour, setEndHour] = useState('');
    const [endMinute, setEndMinute] = useState('');
    const [location, setLocation] = useState('');
    const [client, setClient] = useState('');
    const [description, setDescription] = useState('');

    // Static display for duration since there is no logic
    const durationDisplay = '0 Jam 0 Menit';

    const hours = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }).map((_, i) => i.toString().padStart(2, '0'));

    return (
        <>
            <Head title="Input Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F9F9FF] p-6 font-mulish">
                {/* ── Header ── */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                        Pengajuan Lembur
                    </h1>
                    <p className="text-neutral-500 font-medium mt-1">
                        Isi detail lembur Anda untuk dicatat dalam sistem.
                    </p>
                </div>

                {/* ── Form Container ── */}
                <div className="w-full max-w-4xl rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                        <div className="space-y-8">
                            {/* Tanggal Lembur */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Tanggal Lembur</label>
                                    <DatePicker
                                        date={date ? parseISO(date) : undefined}
                                        setDate={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')}
                                        placeholder="dd/mm/yyyy"
                                        className="w-full h-10 border-neutral-300 font-medium text-neutral-900 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Jam & Durasi */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Jam Mulai</label>
                                    <div className="flex items-center gap-2 w-full">
                                        <Select value={startHour} onValueChange={setStartHour}>
                                            <SelectTrigger className="w-full h-10 border-neutral-300 font-medium text-neutral-900 shadow-sm">
                                                <SelectValue placeholder="HH" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {hours.map((h) => (
                                                    <SelectItem key={h} value={h}>{h}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-neutral-500 font-bold">:</span>
                                        <Select value={startMinute} onValueChange={setStartMinute}>
                                            <SelectTrigger className="w-full h-10 border-neutral-300 font-medium text-neutral-900 shadow-sm">
                                                <SelectValue placeholder="MM" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {minutes.map((m) => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Jam Selesai</label>
                                    <div className="flex items-center gap-2 w-full">
                                        <Select value={endHour} onValueChange={setEndHour}>
                                            <SelectTrigger className="w-full h-10 border-neutral-300 font-medium text-neutral-900 shadow-sm">
                                                <SelectValue placeholder="HH" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {hours.map((h) => (
                                                    <SelectItem key={h} value={h}>{h}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-neutral-500 font-bold">:</span>
                                        <Select value={endMinute} onValueChange={setEndMinute}>
                                            <SelectTrigger className="w-full h-10 border-neutral-300 font-medium text-neutral-900 shadow-sm">
                                                <SelectValue placeholder="MM" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {minutes.map((m) => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Total Durasi</label>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={durationDisplay}
                                        className="h-10 border-neutral-200 bg-neutral-50 font-semibold text-neutral-600 shadow-none focus-visible:ring-0 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Tempat Kerja Lembur */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-800">Tempat Kerja Lembur</label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: Kantor Pusat, Site Bekasi, dsb."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm placeholder:text-neutral-400 placeholder:font-normal"
                                />
                            </div>

                            {/* Nama Pelanggan */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-800">Nama Pelanggan</label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: PT Pertamina, Internal, dsb."
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                    className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm placeholder:text-neutral-400 placeholder:font-normal"
                                />
                            </div>

                            {/* Job Deskripsi */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-800">Job Deskripsi</label>
                                <textarea
                                    placeholder="Jelaskan pekerjaan atau aktivitas yang dilakukan selama lembur secara rinci..."
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal shadow-sm focus:border-[#035EA9] focus:outline-none focus:ring-1 focus:ring-[#035EA9] resize-y"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-neutral-100">
                            <Link
                                href="/employee/overtime"
                                className="inline-flex h-12 min-w-[130px] items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 text-[15px] font-extrabold text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-[#035EA9] px-6 text-[15px] font-extrabold text-white shadow-sm hover:bg-[#035EA9]/90 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035EA9] focus-visible:ring-offset-2"
                            >
                                Submit Overtime
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

OvertimeCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Lembur', href: '/employee/overtime' },
            { title: 'Pengajuan Lembur', href: '/employee/overtime/create' },
        ]}
    >
        {page}
    </AppLayout>
);
