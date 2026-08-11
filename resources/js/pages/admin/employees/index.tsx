import { Head } from '@inertiajs/react';
import { Search, SlidersHorizontal, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

const employeesMock = [
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Alpha', status: 'Active' },
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Beta', status: 'Inactive' },
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Alpha', status: 'Active' },
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Alpha', status: 'Active' },
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Alpha', status: 'Active' },
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Alpha', status: 'Active' },
    { name: 'Lorem Ipsum', nik: 'xx-0000', email: 'Lorem@sucofindo.com', project: 'Project Alpha', status: 'Active' },
];

export default function EmployeesIndex() {
    return (
        <>
            <Head title="Karyawan" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#F9F9FF] p-6 font-mulish">
                
                {/* ── Header & Control Bar ────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
                    {/* Title Section */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Karyawan</h1>
                        <p className="text-neutral-500 font-medium">Mengelola data karyawan dan penugasan proyek.</p>
                    </div>

                    {/* Control Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-[320px]">
                            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                            <Input 
                                placeholder="Cari Karyawan..." 
                                className="pl-10 h-10 border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9]" 
                            />
                        </div>
                        <Button variant="outline" className="flex h-10 w-full sm:w-auto items-center gap-2 border-neutral-300 bg-white px-4 font-bold text-neutral-700 shadow-sm hover:bg-neutral-50">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button className="flex h-10 w-full items-center gap-2 bg-[#035EA9] px-4 font-bold text-white shadow-sm hover:bg-[#035EA9]/90 sm:w-auto">
                            <Plus className="h-5 w-5" />
                            Tambah Karyawan
                        </Button>
                    </div>
                </div>

                {/* ── Table Container ───────────────────────────────── */}
                <div className="mt-2 flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-neutral-200 bg-[#F8FAFC] text-neutral-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">Karyawan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">NIK</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Email</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Projek</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                {employeesMock.map((emp, i) => (
                                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2F6] font-bold text-[#828D99]">
                                                    LI
                                                </div>
                                                <span className="font-bold text-neutral-900">{emp.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-neutral-500">{emp.nik}</td>
                                        <td className="px-6 py-4 font-semibold text-neutral-500">{emp.email}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="rounded-md border-none bg-[#E5F0F9] text-[#035EA9] hover:bg-[#D6E4F0] px-2.5 py-1 text-[13px] font-bold">
                                                {emp.project}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {emp.status === 'Active' ? (
                                                <Badge className="rounded-md border-none bg-[#E0F2FE] text-[#0284C7] hover:bg-[#E0F2FE]/80 px-2.5 py-1 text-[13px] font-bold">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge className="rounded-md border-none bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2]/80 px-2.5 py-1 text-[13px] font-bold">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination Footer ─────────────────────────────── */}
                    <div className="mt-auto flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 bg-white px-6 py-4 text-sm text-neutral-500 gap-4">
                        <span className="font-semibold text-[#64748B]">Menampilkan 1 to 3 of 45 entries</span>
                        <div className="flex items-center gap-1">
                            <button className="flex h-8 w-8 items-center justify-center rounded text-[#94A3B8] hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded bg-[#035EA9] font-bold text-white transition-colors">
                                1
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded font-bold text-neutral-500 hover:bg-neutral-100 transition-colors">
                                2
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded font-bold text-neutral-500 hover:bg-neutral-100 transition-colors">
                                3
                            </button>
                            <span className="flex h-8 w-8 items-center justify-center text-neutral-400 font-bold">...</span>
                            <button className="flex h-8 w-8 items-center justify-center rounded text-[#94A3B8] hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

EmployeesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Karyawan', href: '/admin/employees' }]}>
        {page}
    </AppLayout>
);
