import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Save, AlertTriangle, CheckCircle2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

export default function EmployeesEdit() {
    const [isActive, setIsActive] = useState(true);
    
    // Dialog states
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isResetSuccessOpen, setIsResetSuccessOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleSave = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    return (
        <>
            <Head title="Edit Karyawan" />
            <div className="flex h-full flex-1 flex-col bg-[#F9F9FF] p-8 font-mulish relative">
                
                {/* ── Header ────────────────────────────────────────── */}
                <div className="mb-6">
                    <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight">
                        Edit Karyawan
                    </h1>
                    <p className="text-[#64748B] font-medium text-[15px] mt-1">
                        Enter the details to create a new employee record in the system.
                    </p>
                </div>

                {/* ── Form Card ─────────────────────────────────────── */}
                <div className="rounded-xl border border-neutral-200 bg-white flex flex-col w-full shadow-sm">
                    <div className="p-8 flex flex-col gap-8">
                        
                        {/* 1. Informasi Pribadi */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Informasi Pribadi</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Nama Lengkap</label>
                                    <Input 
                                        defaultValue="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">NIK</label>
                                    <Input 
                                        defaultValue="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Alamat Email</label>
                                    <Input 
                                        defaultValue="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Nomor Telepon</label>
                                    <Input 
                                        defaultValue="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] w-full bg-neutral-200"></div>

                        {/* 2. Rincian Karyawan */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Rincian Karyawan</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Assigned Project(s)</label>
                                    <div className="flex min-h-11 w-full items-center gap-2 rounded-md border border-neutral-200 bg-[#F8FAFC] px-3 py-2 shadow-sm">
                                        <div className="flex items-center gap-1.5 rounded bg-[#E2E8F0] px-2.5 py-1 text-sm font-semibold text-[#475569]">
                                            Project Alpha
                                            <button className="text-[#64748B] hover:text-[#0F172A]"><X className="h-3 w-3" /></button>
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Type to add..." 
                                            className="flex-1 bg-transparent text-sm font-medium text-[#64748B] outline-none placeholder:text-[#94A3B8]"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Account Status</label>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        {/* Custom Toggle Switch */}
                                        <button 
                                            onClick={() => setIsActive(!isActive)}
                                            type="button"
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035EA9] focus-visible:ring-offset-2 ${isActive ? 'bg-[#0B3B8B]' : 'bg-neutral-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-[15px] font-semibold text-[#1E293B] w-12">
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] w-full bg-neutral-200"></div>

                        {/* 3. Security */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Security</h2>
                            
                            <div className="flex flex-col gap-2 max-w-[50%]">
                                <label className="text-[14px] font-bold text-[#1E293B]">Keamanan Akun</label>
                                
                                <Button 
                                    variant="outline" 
                                    className="w-[180px] h-10 border-[#035EA9] text-[#035EA9] font-bold hover:bg-[#F0F5FA] flex justify-center gap-2 mt-1"
                                    onClick={() => setIsResetOpen(true)}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Password
                                </Button>
                                
                                <p className="text-[13px] font-medium text-[#64748B] mt-1">
                                    Reset password akan mengembalikan password karyawan ke 123.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* ── Footer Actions ─────────────────────────────────── */}
                    <div className="border-t border-neutral-200 bg-[#F8FAFC] p-6 rounded-b-xl flex justify-end gap-4">
                        <Link href="/admin/employees">
                            <Button variant="outline" className="h-11 px-6 border-neutral-300 font-bold text-neutral-700 bg-white hover:bg-neutral-50">
                                Cancel
                            </Button>
                        </Link>
                        <Button 
                            className="h-11 px-6 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 font-bold text-white flex gap-2"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4" />
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>

                {/* ── Toast Notification ─────────────────────────────── */}
                {showSuccessToast && (
                    <div className="fixed top-[88px] right-8 z-50 flex items-start justify-between w-[380px] bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-neutral-100 border-l-[6px] border-l-[#10B981] p-4 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="flex items-start gap-4">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]">
                                <Check className="h-4 w-4 text-white" strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[#1E293B] text-[15px]">Berhasil</span>
                                <span className="text-[#64748B] text-[14px] font-medium mt-0.5">Perubahan Berhasil di Simpan</span>
                            </div>
                        </div>
                        <button onClick={() => setShowSuccessToast(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

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
                                className="w-full bg-[#C81E1E] hover:bg-[#B91C1C] text-white font-bold h-11 sm:w-full"
                                onClick={() => {
                                    setIsResetOpen(false);
                                    setIsResetSuccessOpen(true);
                                }}
                            >
                                Reset Password
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
                                Kata sandi telah berhasil diatur ulang. Silahkan login kembali untuk memasukkan Password yang baru!
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
        { title: 'Edit Karyawan', href: '/admin/employees/edit' } // Simulated breadcrumb, dynamic route handles correctly.
    ]}>
        {page}
    </AppLayout>
);
