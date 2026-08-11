import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, AlertTriangle, CheckCircle2, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface Project {
    id: number;
    name: string;
    code: string;
}

interface EmployeeData {
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

interface EmployeesEditProps {
    employee: EmployeeData;
    projects: Project[];
}

export default function EmployeesEdit({ employee, projects }: EmployeesEditProps) {
    const activeProjectId = employee.projects?.[0]?.id ? String(employee.projects[0].id) : '';

    const { data, setData, put, processing, errors } = useForm({
        name: employee.user?.name || '',
        nik: employee.nik || '',
        email: employee.user?.email || '',
        phone: employee.phone || '',
        project_id: activeProjectId,
        is_active: employee.user?.is_active ?? true,
    });

    // Dialog states
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isResetSuccessOpen, setIsResetSuccessOpen] = useState(false);
    const [isResetProcessing, setIsResetProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/employees/${employee.id}`);
    };

    const handleResetPassword = () => {
        setIsResetProcessing(true);
        router.post(
            `/admin/employees/${employee.id}/reset-password`,
            {},
            {
                onSuccess: () => {
                    setIsResetProcessing(false);
                    setIsResetOpen(false);
                    setIsResetSuccessOpen(true);
                },
                onError: () => {
                    setIsResetProcessing(false);
                },
            }
        );
    };

    return (
        <>
            <Head title={`Edit Karyawan - ${employee.user?.name}`} />
            <div className="flex h-full flex-1 flex-col bg-[#F9F9FF] p-8 font-mulish relative">
                
                {/* ── Header ────────────────────────────────────────── */}
                <div className="mb-6">
                    <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight">
                        Edit Data Karyawan
                    </h1>
                    <p className="text-[#64748B] font-medium text-[15px] mt-1">
                        Perbarui detail informasi karyawan dan penugasan proyek.
                    </p>
                </div>

                {/* ── Form Card ─────────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white flex flex-col w-full shadow-sm">
                    <div className="p-8 flex flex-col gap-8">
                        
                        {/* 1. Informasi Pribadi */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Informasi Pribadi</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <Input 
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">
                                        NIK <span className="text-red-500">*</span>
                                    </label>
                                    <Input 
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value)}
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.nik && <p className="text-xs text-red-500 font-semibold">{errors.nik}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">
                                        Alamat Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input 
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Nomor Telepon</label>
                                    <Input 
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone}</p>}
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] w-full bg-neutral-200"></div>

                        {/* 2. Rincian Karyawan */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Rincian Karyawan</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Penugasan Proyek (Assigned Project)</label>
                                    <select
                                        value={data.project_id}
                                        onChange={(e) => setData('project_id', e.target.value)}
                                        className="h-11 w-full rounded-md border border-neutral-200 bg-[#F8FAFC] px-3 font-semibold text-neutral-800 shadow-sm focus:border-[#035EA9] focus:outline-none focus:ring-1 focus:ring-[#035EA9]"
                                    >
                                        <option value="">-- Pilih Proyek (Opsional) --</option>
                                        {projects.map((proj) => (
                                            <option key={proj.id} value={proj.id}>
                                                {proj.name} ({proj.code})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.project_id && <p className="text-xs text-red-500 font-semibold">{errors.project_id}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Status Akun</label>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        {/* Custom Toggle Switch */}
                                        <button 
                                            onClick={() => setData('is_active', !data.is_active)}
                                            type="button"
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035EA9] focus-visible:ring-offset-2 ${data.is_active ? 'bg-[#0B3B8B]' : 'bg-neutral-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-[15px] font-semibold text-[#1E293B] w-16">
                                            {data.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        Nonaktifkan jika karyawan sedang cuti panjang atau dinonaktifkan sementara.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] w-full bg-neutral-200"></div>

                        {/* 3. Security */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Keamanan Akun</h2>
                            
                            <div className="flex flex-col gap-2 max-w-[500px]">
                                <label className="text-[14px] font-bold text-[#1E293B]">Reset Kata Sandi</label>
                                
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    className="w-[180px] h-10 border-[#035EA9] text-[#035EA9] font-bold hover:bg-[#F0F5FA] flex justify-center gap-2 mt-1"
                                    onClick={() => setIsResetOpen(true)}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Password
                                </Button>
                                
                                <p className="text-[13px] font-medium text-[#64748B] mt-1">
                                    Reset password akan mengembalikan kata sandi karyawan ke default (<b>123</b>).
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* ── Footer Actions ─────────────────────────────────── */}
                    <div className="border-t border-neutral-200 bg-[#F8FAFC] p-6 rounded-b-xl flex justify-end gap-4">
                        <Link href="/admin/employees">
                            <Button type="button" variant="outline" className="h-11 px-6 border-neutral-300 font-bold text-neutral-700 bg-white hover:bg-neutral-50">
                                Batal
                            </Button>
                        </Link>
                        <Button 
                            type="submit"
                            disabled={processing}
                            className="h-11 px-6 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 font-bold text-white flex gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>

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
                                Apakah Anda yakin ingin mereset kata sandi karyawan ini? Tindakan ini akan mereset password ke bawaan (<b>123</b>).
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-col w-full gap-3 mt-6">
                            <Button 
                                disabled={isResetProcessing}
                                className="w-full bg-[#C81E1E] hover:bg-[#B91C1C] text-white font-bold h-11 sm:w-full"
                                onClick={handleResetPassword}
                            >
                                {isResetProcessing ? 'Memproses...' : 'Reset Password'}
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
                                Kata sandi telah berhasil diatur ulang menjadi <b>123</b>. Karyawan dapat login kembali menggunakan password ini!
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

            </div>
        </>
    );
}

EmployeesEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Karyawan', href: '/admin/employees' },
        { title: 'Edit Karyawan', href: '#' }
    ]}>
        {page}
    </AppLayout>
);
