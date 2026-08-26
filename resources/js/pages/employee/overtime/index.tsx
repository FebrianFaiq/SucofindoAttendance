import { Head, Link } from '@inertiajs/react';
import { Clock, Plus, Clock3, FileText, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

// Data disediakan dari backend

function getStatusBadge(status: string) {
    if (status === 'Belum Direview') {
        return (
            <span className="inline-flex items-center rounded-md bg-[#EEF4FC] px-2.5 py-1 text-xs font-bold text-[#035EA9]">
                Belum Direview
            </span>
        );
    }
    if (status === 'Sudah Direview') {
        return (
            <span className="inline-flex items-center rounded-md bg-[#ECFDF5] px-2.5 py-1 text-xs font-bold text-[#059669]">
                Sudah Direview
            </span>
        );
    }
    if (status === 'Canceled') {
        return (
            <span className="inline-flex items-center rounded-md bg-[#FEF2F2] px-2.5 py-1 text-xs font-bold text-[#DC2626]">
                Canceled
            </span>
        );
    }
    return null;
}

export default function OvertimeIndex({ overtimes, totalDurationMtd, lastStatus }: any) {
    return (
        <>
            <Head title="Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F9F9FF] p-6 font-mulish">
                {/* ── Header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                            Lembur
                        </h1>
                        <p className="text-neutral-500 font-medium mt-1">
                            Riwayat dan catatan lembur Anda.
                        </p>
                    </div>
                    <Link
                        href="/employee/overtime/create"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#035EA9] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#035EA9]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035EA9] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        Ajukan Lembur
                    </Link>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Lembur Hari Ini */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-neutral-600 mb-4">
                            <Clock3 className="h-5 w-5" />
                            <span className="text-sm font-bold">Total Lembur Hari Ini</span>
                        </div>
                        <h2 className="text-4xl font-black text-[#101828]">0 Jam</h2>
                    </div>

                    {/* Total Durasi Lembur */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-neutral-600 mb-4">
                            <Clock className="h-5 w-5" />
                            <span className="text-sm font-bold">Total Durasi Lembur</span>
                        </div>
                        <h2 className="text-4xl font-black text-[#101828] mb-1">{totalDurationMtd || '0h 0m'}</h2>
                        <span className="text-xs font-semibold text-neutral-400">Month to date</span>
                    </div>

                    {/* Status Pengajuan Terakhir */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-neutral-600 mb-6">
                            <FileText className="h-5 w-5" />
                            <span className="text-sm font-bold">Status Pengajuan Terakhir</span>
                        </div>
                        <div className="mt-auto">
                            <div className="inline-flex items-center gap-2 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-sm font-bold text-[#1D4ED8]">
                                <Info className="h-4 w-4 text-[#3B82F6]" />
                                {lastStatus || 'Belum Ada Data'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Riwayat Lembur Table ── */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-5 border-b border-neutral-200">
                        <h2 className="text-lg font-bold text-neutral-900">Riwayat Lembur</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-neutral-500 border-b border-neutral-200 uppercase tracking-wider text-[11px] font-extrabold">
                                <tr>
                                    <th className="px-6 py-4">TANGGAL</th>
                                    <th className="px-6 py-4">TEMPAT KERJA</th>
                                    <th className="px-6 py-4">NAMA PELANGGAN</th>
                                    <th className="px-6 py-4">DURASI</th>
                                    <th className="px-6 py-4 text-right">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                {overtimes.data.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-neutral-600">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {item.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {item.client}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-neutral-900">
                                            {item.duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {getStatusBadge(item.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 px-6 py-4 mt-auto">
                        <p className="text-sm font-semibold text-neutral-500">
                            Menampilkan {overtimes.from || 0}-{overtimes.to || 0} dari {overtimes.total || 0} entri
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded bg-[#035EA9] text-xs font-bold text-white">
                                1
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold">
                                2
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold">
                                3
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

OvertimeIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Lembur', href: '/employee/overtime' }]}>
        {page}
    </AppLayout>
);
