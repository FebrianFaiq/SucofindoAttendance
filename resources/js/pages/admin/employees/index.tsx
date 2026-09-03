import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, ChevronLeft, ChevronRight, IdCard, ClipboardList, Pen, RotateCcw, Trash2, LayoutGrid, AlertTriangle, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';

interface EmployeeItem {
    id: number;
    user_id: number;
    nik: string;
    division?: string | null;
    jabatan: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        is_active: boolean;
    };
    projects: {
        id: number;
        name: string;
        code: string;
        pivot?: {
            status: string;
        };
    }[];
    salaries?: {
        id: number;
        base_salary: string;
        effective_date: string;
    }[];
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

interface EmployeesIndexProps {
    employees: PaginatedData<EmployeeItem>;
    filters?: {
        search?: string;
        per_page?: string | number;
    };
}

export default function EmployeesIndex({ employees, filters }: EmployeesIndexProps) {
    const { default_password } = usePage<any>().props;
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    // Dialog states
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isResetSuccessOpen, setIsResetSuccessOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const openEmployeeDetails = (emp: EmployeeItem) => {
        setSelectedEmployee(emp);
        setIsSheetOpen(true);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) {
e.preventDefault();
}

        router.get('/admin/employees', { search: searchTerm, per_page: perPage }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(e.target.value);
        router.get('/admin/employees', { search: searchTerm, per_page: e.target.value }, { preserveState: true, replace: true });
    };

    const handleResetPassword = () => {
        if (!selectedEmployee) {
return;
}

        setIsProcessing(true);
        router.post(
            `/admin/employees/${selectedEmployee.id}/reset-password`,
            {},
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setIsResetOpen(false);
                    setIsResetSuccessOpen(true);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            }
        );
    };

    const handleDeleteEmployee = () => {
        if (!selectedEmployee) {
return;
}

        setIsProcessing(true);
        router.delete(`/admin/employees/${selectedEmployee.id}`, {
            onSuccess: () => {
                setIsProcessing(false);
                setIsDeleteOpen(false);
                setIsSheetOpen(false);
                setSelectedEmployee(null);
            },
            onError: () => {
                setIsProcessing(false);
            },
        });
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
                        <form onSubmit={handleSearch} className="relative w-full sm:w-[320px]">
                            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama, NIK, email..."
                                className="pl-10 h-10 border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9]"
                            />
                        </form>
                        <Link href="/admin/employees/create" className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11 px-5 flex items-center gap-2 shadow-sm rounded-xl text-xs sm:w-auto justify-center w-full whitespace-nowrap shrink-0">
                            <Plus className="h-4 w-4 shrink-0" />
                            Tambah Karyawan
                        </Link>
                    </div>
                </div>

                {/* ── Table Container ───────────────────────────────── */}
                <div className="mt-2 flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 bg-[#F8FAFC] text-neutral-600 whitespace-nowrap">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">Karyawan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">NIK</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Email</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Jabatan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Proyek / Bidang</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                {employees.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 font-medium">
                                            Tidak ada data karyawan ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.data.map((emp) => {
                                        const activeProject = emp.projects?.[0]?.name ?? 'Belum Ditugaskan';

                                        return (
                                            <tr key={emp.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4 min-w-[250px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F0F9] font-bold text-[#035EA9] shrink-0">
                                                            {getInitials(emp.user?.name)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-neutral-900">{emp.user?.name}</span>
                                                            <span className="text-[11px] font-bold">
                                                                {emp.user?.role === 'intern' ? (
                                                                    <span className="text-[#00A099]">Magang</span>
                                                                ) : (
                                                                    <span className="text-[#035EA9]">PTT Proyek</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-neutral-600">
                                                    {emp.nik ? emp.nik : <span className="text-neutral-400 font-bold">—</span>}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-neutral-600">{emp.user?.email}</td>
                                                <td className="px-6 py-4 font-semibold text-neutral-600">
                                                    {emp.user?.role === 'intern' ? (
                                                        <span className="text-neutral-400">—</span>
                                                    ) : (
                                                        emp.jabatan ? emp.jabatan : <span className="text-neutral-400 font-bold">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {!emp.user?.is_active ? (
                                                        <span className="text-neutral-400 font-bold">—</span>
                                                    ) : emp.user?.role === 'intern' ? (
                                                        <Badge variant="secondary" className="rounded-md border-none bg-[#00A099]/10 text-[#00A099] hover:bg-[#00A099]/20 px-2.5 py-1 text-[13px] font-bold">
                                                            {emp.division || '—'}
                                                        </Badge>
                                                    ) : activeProject === 'Belum Ditugaskan' ? (
                                                        <Badge variant="secondary" className="rounded-md border-none bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 text-[13px] font-bold">
                                                            Belum Ditugaskan
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="rounded-md border-none bg-[#035EA9]/10 text-[#035EA9] hover:bg-[#035EA9]/20 px-2.5 py-1 text-[13px] font-bold">
                                                            {activeProject}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {emp.user?.is_active ? (
                                                        <Badge className="rounded-md border-none bg-[#E0F2FE] text-[#0284C7] hover:bg-[#E0F2FE]/80 px-2.5 py-1 text-[13px] font-bold">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="rounded-md border-none bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2]/80 px-2.5 py-1 text-[13px] font-bold">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => openEmployeeDetails(emp)}
                                                        className="font-bold text-[#035EA9] hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ──────────────────────────────────── */}
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
                                Menampilkan {employees.from || 0} to {employees.to || 0} of {employees.total} entries
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            {employees.prev_page_url ? (
                                <Link
                                    href={employees.prev_page_url}
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

                            {employees.links
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

                            {employees.next_page_url ? (
                                <Link
                                    href={employees.next_page_url}
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

                {/* ── Employee Details Sidebar (Sheet) ──────────────── */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side="right" className="w-[340px] sm:w-[380px] p-0 font-mulish overflow-y-auto rounded-l-2xl">
                        <SheetHeader className="border-b border-neutral-200 px-8 py-4">
                            <SheetTitle className="text-lg font-bold text-neutral-900">Detail Karyawan</SheetTitle>
                        </SheetHeader>

                        {selectedEmployee && (
                            <div className="flex flex-col px-8 pb-8 pt-4 gap-5">
                                {/* Profile Header */}
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="relative mb-2 h-20 w-20">
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#E5F0F9] text-xl font-bold text-[#035EA9]">
                                            {getInitials(selectedEmployee.user?.name)}
                                        </div>
                                        <div className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${selectedEmployee.user?.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    </div>
                                    <h2 className="text-lg font-bold text-neutral-900">{selectedEmployee.user?.name}</h2>
                                    <div className="flex items-center gap-1.5 text-neutral-500 mt-0.5">
                                        <IdCard className="h-3.5 w-3.5" />
                                        <span className="text-xs font-semibold">NIK: {selectedEmployee.nik}</span>
                                    </div>
                                    <div className="mt-1.5">
                                        <Badge className={`text-[11px] font-bold border-none ${selectedEmployee.user?.role === 'intern'
                                            ? 'bg-[#00A099]/10 text-[#00A099] hover:bg-[#00A099]/20'
                                            : 'bg-[#035EA9]/10 text-[#035EA9] hover:bg-[#035EA9]/20'
                                            }`}>
                                            {selectedEmployee.user?.role === 'intern' ? 'Magang' : 'PTT Proyek'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Employee Info Card */}
                                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                                    <div className="flex flex-col gap-y-5 box-border w-full">
                                        {/* Row 1: Projek/Bidang & NIK */}
                                        <div className="grid grid-cols-2 gap-x-3 w-full">
                                            <div className="flex flex-col h-full w-full min-w-0">
                                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                                    {selectedEmployee.user?.role === 'intern' ? 'BIDANG' : 'PROJEK'}
                                                </span>
                                                <div className="w-full border-b-2 border-[#035EA9] pb-1 mt-1 flex-1 flex flex-col justify-end">
                                                    <span className="text-xs font-semibold text-neutral-900 break-words block">
                                                        {selectedEmployee.user?.role === 'intern'
                                                            ? (selectedEmployee.division || '—')
                                                            : (selectedEmployee.projects?.[0]?.name ?? 'Belum Ditugaskan')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col h-full w-full min-w-0">
                                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">NIK</span>
                                                <div className="w-full border-b-2 border-[#035EA9] pb-1 mt-1 flex-1 flex flex-col justify-end">
                                                    <span className="text-xs font-semibold text-neutral-900 break-words block">{selectedEmployee.nik || '—'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Email & Jabatan */}
                                        <div className="grid grid-cols-2 gap-x-3 w-full">
                                            <div className="flex flex-col h-full w-full min-w-0">
                                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">EMAIL</span>
                                                <div className="w-full border-b-2 border-[#035EA9] pb-1 mt-1 flex-1 flex flex-col justify-end">
                                                    <a href={`mailto:${selectedEmployee.user?.email}`} className="text-xs font-semibold text-[#035EA9] hover:underline break-all block">
                                                        {selectedEmployee.user?.email}
                                                    </a>
                                                </div>
                                            </div>
                                            {selectedEmployee.user?.role !== 'intern' && (
                                                <div className="flex flex-col h-full w-full min-w-0">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">JABATAN</span>
                                                    <div className="w-full border-b-2 border-[#035EA9] pb-1 mt-1 flex-1 flex flex-col justify-end">
                                                        <span className="text-xs font-semibold text-neutral-900 break-words block">
                                                            {selectedEmployee.jabatan || '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Row 3: Gaji Pokok (hanya PTT) */}
                                        {selectedEmployee.user?.role !== 'intern' && (
                                            <div className="grid grid-cols-1 w-full mt-2">
                                                <div className="flex flex-col h-full w-full min-w-0">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">GAJI POKOK</span>
                                                    <div className="w-full border-b-2 border-[#035EA9] pb-1 mt-1 flex-1 flex flex-col justify-end">
                                                        <span className="text-xs font-semibold text-neutral-900 break-words block">
                                                            {selectedEmployee.salaries && selectedEmployee.salaries.length > 0 ? (
                                                                <>
                                                                    Rp {Number(selectedEmployee.salaries[0].base_salary).toLocaleString('id-ID')}{' '}
                                                                    <span className="text-neutral-500 font-medium ml-1">
                                                                        (Sejak {new Intl.DateTimeFormat('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        }).format(new Date(selectedEmployee.salaries[0].effective_date))})
                                                                    </span>
                                                                </>
                                                            ) : 'Belum Diset'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Projects Section */}
                                {selectedEmployee.user?.role !== 'intern' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-1.5 text-[#035EA9]">
                                            <ClipboardList className="h-4 w-4" />
                                            <h3 className="font-bold text-neutral-900 text-sm">Projek yang sedang Berjalan</h3>
                                        </div>

                                        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F5F9]">
                                                <LayoutGrid className="h-4 w-4 text-[#64748B]" />
                                            </div>
                                            <div className="flex flex-col leading-tight gap-0.5">
                                                <span className="text-xs font-bold text-neutral-900">
                                                    {selectedEmployee.projects?.[0]?.name ?? 'Belum ada proyek aktif'}
                                                </span>
                                                <span className="text-[11px] font-semibold text-neutral-500">
                                                    {selectedEmployee.projects?.[0]?.code ?? 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-2 flex flex-col gap-3 pt-3 border-t border-neutral-200">
                                    <Link href={`/admin/employees/${selectedEmployee.id}/edit`} className="w-full">
                                        <Button className="w-full bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 h-9 text-xs text-white font-bold flex gap-2">
                                            <Pen className="h-3.5 w-3.5" />
                                            Edit Karyawan
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full border-neutral-300 h-9 text-xs font-bold text-neutral-700 flex gap-2 hover:bg-neutral-50"
                                        onClick={() => setIsResetOpen(true)}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Reset Password
                                    </Button>
                                    <Button
                                        className="w-full bg-[#FEE2E2] hover:bg-[#FEE2E2]/80 text-[#DC2626] h-9 text-xs font-bold border-none flex gap-2"
                                        onClick={() => setIsDeleteOpen(true)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Hapus Karyawan
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* ── Dialogs ────────────────────────────────────────────── */}

                {/* 1. Reset Password Confirmation */}
                <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                    <DialogContent className="sm:max-w-[420px] p-8 font-mulish text-center border-none">
                        <DialogHeader className="flex flex-col items-center justify-center sm:text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-[#1E293B]">Reset Password?</DialogTitle>
                            <DialogDescription className="text-neutral-500 font-medium">
                                Apakah Anda yakin ingin mereset kata sandi karyawan ini? Tindakan ini akan mereset password ke bawaan (<b>{default_password}</b>).
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-col w-full gap-3 mt-6">
                            <Button
                                disabled={isProcessing}
                                className="w-full bg-[#C81E1E] hover:bg-[#B91C1C] text-white font-bold h-11 sm:w-full"
                                onClick={handleResetPassword}
                            >
                                {isProcessing ? 'Memproses...' : 'Reset Password'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full border-neutral-300 font-bold text-neutral-700 h-11 hover:bg-neutral-50 sm:w-full sm:mt-0">
                                    Batalkan
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 2. Reset Password Success */}
                <Dialog open={isResetSuccessOpen} onOpenChange={setIsResetSuccessOpen}>
                    <DialogContent className="sm:max-w-[420px] p-8 font-mulish text-center border-none">
                        <DialogHeader className="flex flex-col items-center justify-center sm:text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-4">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-[#1E293B]">Reset Berhasil!</DialogTitle>
                            <DialogDescription className="text-neutral-500 font-medium pt-2">
                                Kata sandi telah berhasil diatur ulang menjadi <b>{default_password}</b>. Karyawan dapat login menggunakan password baru ini!
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="w-full mt-6 sm:justify-center">
                            <Button
                                className="w-full bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11"
                                onClick={() => setIsResetSuccessOpen(false)}
                            >
                                Mengerti
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 3. Delete Employee Confirmation */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="sm:max-w-[420px] p-8 font-mulish text-center border-none">
                        <DialogHeader className="flex flex-col items-center justify-center sm:text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-[#1E293B]">Hapus Karyawan?</DialogTitle>
                            <DialogDescription className="text-[15px] font-medium text-[#64748B] mt-3 leading-relaxed text-center">
                                Apakah Anda yakin ingin menghapus data karyawan ini? Data karyawan dan akun akan dihapus dari sistem.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-col w-full gap-3 mt-6">
                            <Button
                                disabled={isProcessing}
                                className="w-full bg-[#C81E1E] hover:bg-[#B91C1C] text-white font-bold h-11 sm:w-full"
                                onClick={handleDeleteEmployee}
                            >
                                {isProcessing ? 'Memproses...' : 'Hapus Karyawan'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full border-neutral-300 font-bold text-neutral-700 h-11 hover:bg-neutral-50 sm:w-full sm:mt-0">
                                    Batalkan
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    );
}

EmployeesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Karyawan', href: '/admin/employees' }]}>
        {page}
    </AppLayout>
);
