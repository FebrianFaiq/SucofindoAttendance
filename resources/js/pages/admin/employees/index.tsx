import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, ChevronLeft, ChevronRight, IdCard, ClipboardList, Pen, RotateCcw, Trash2, LayoutGrid, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface EmployeeItem {
    id: number;
    user_id: number;
    employee_code?: string;
    nik: string;
    phone: string | null;
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
    };
}

export default function EmployeesIndex({ employees, filters }: EmployeesIndexProps) {
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    
    // Dialog states
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isResetSuccessOpen, setIsResetSuccessOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const openEmployeeDetails = (emp: EmployeeItem) => {
        setSelectedEmployee(emp);
        setIsSheetOpen(true);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/employees', { search: searchTerm }, { preserveState: true, replace: true });
    };

    const handleResetPassword = () => {
        if (!selectedEmployee) return;
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
        if (!selectedEmployee) return;
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
        if (!name) return 'EM';
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
                        <Link href="/admin/employees/create" className="flex h-10 w-full items-center gap-2 rounded-md bg-[#035EA9] px-4 font-bold text-white shadow-sm hover:bg-[#035EA9]/90 sm:w-auto justify-center">
                            <Plus className="h-5 w-5" />
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
                                    <th className="px-6 py-4 font-bold tracking-wide">Projek</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                {employees.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 font-medium">
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
                                                        <span className="font-bold text-neutral-900 leading-tight">{emp.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-neutral-600 whitespace-nowrap">{emp.nik}</td>
                                                <td className="px-6 py-4 font-semibold text-neutral-600 whitespace-nowrap">{emp.user?.email}</td>
                                                <td className="px-6 py-4 min-w-[200px]">
                                                    <Badge variant="secondary" className="rounded-md border-none bg-[#E5F0F9] text-[#035EA9] hover:bg-[#D6E4F0] px-2.5 py-1 text-[13px] font-bold whitespace-normal text-left leading-tight">
                                                        {activeProject}
                                                    </Badge>
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

                    {/* ── Pagination Footer ─────────────────────────────── */}
                    <div className="mt-auto flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 bg-white px-6 py-4 text-sm text-neutral-500 gap-4">
                        <span className="font-semibold text-[#64748B]">
                            Menampilkan {employees.from ?? 0} to {employees.to ?? 0} of {employees.total} entries
                        </span>
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
                                </div>

                                {/* Employee Info Card */}
                                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">PROJEK</span>
                                            <div className="border-b-2 border-[#035EA9] pb-1.5">
                                                <span className="text-xs font-semibold text-neutral-900">
                                                    {selectedEmployee.projects?.[0]?.name ?? 'Belum Ditugaskan'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">NIK</span>
                                            <div className="border-b-2 border-[#035EA9] pb-1.5">
                                                <span className="text-xs font-semibold text-neutral-900">{selectedEmployee.nik}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">EMAIL</span>
                                            <div className="border-b-2 border-[#035EA9] pb-1.5 truncate">
                                                <a href={`mailto:${selectedEmployee.user?.email}`} className="text-xs font-semibold text-[#035EA9] hover:underline truncate block">
                                                    {selectedEmployee.user?.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">NO. TELEPON</span>
                                            <div className="border-b-2 border-[#035EA9] pb-1.5">
                                                <span className="text-xs font-semibold text-neutral-900">
                                                    {selectedEmployee.phone || '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Projects Section */}
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
                            <DialogDescription className="text-[15px] font-medium text-[#64748B] mt-3 leading-relaxed text-center">
                                Apakah Anda yakin ingin mereset kata sandi karyawan ini? Tindakan ini akan mereset password ke bawaan (123).
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
                            <DialogDescription className="text-[15px] font-medium text-[#64748B] mt-3 leading-relaxed text-center">
                                Kata sandi telah berhasil diatur ulang menjadi <b>123</b>. Karyawan dapat login menggunakan password baru ini!
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
