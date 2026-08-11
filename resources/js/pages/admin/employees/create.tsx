import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, UserPlus, X, Check } from 'lucide-react';

export default function EmployeesCreate() {
    const [isActive, setIsActive] = useState(true);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleSave = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    return (
        <>
            <Head title="Tambah Karyawan" />
            <div className="flex h-full flex-1 flex-col bg-[#F9F9FF] p-8 font-mulish">
                
                {/* ── Header ────────────────────────────────────────── */}
                <div className="mb-6">
                    <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight">
                        Tambah Karyawan Baru
                    </h1>
                    <p className="text-[#64748B] font-medium text-[15px] mt-1">
                        Masukkan detailnya untuk membuat catatan karyawan baru di sistem.
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
                                        placeholder="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">NIK</label>
                                    <Input 
                                        placeholder="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Alamat Email</label>
                                    <Input 
                                        placeholder="Lorem Ipsum" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Nomor Telepon</label>
                                    <Input 
                                        placeholder="Lorem Ipsum" 
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
                                            Lorem Ipsum
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

                        {/* 3. Keamanan */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Keamanan</h2>
                            
                            <div className="flex flex-col gap-2 max-w-[50%]">
                                <label className="text-[14px] font-bold text-[#1E293B]">Default Password</label>
                                <div className="relative">
                                    <Input 
                                        type="text"
                                        defaultValue="123" 
                                        disabled
                                        className="h-11 bg-[#F1F5F9] border-neutral-200 text-[#64748B] font-semibold focus-visible:ring-0 opacity-100 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[13px] font-medium text-[#64748B]">
                                    Password default: 123. User dapat mengganti password setelah login pertama.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* ── Footer Actions ─────────────────────────────────── */}
                    <div className="border-t border-neutral-200 bg-[#F8FAFC] p-6 rounded-b-xl flex justify-end gap-4">
                        <Link href="/admin/employees">
                            <Button variant="outline" className="h-11 px-6 border-neutral-300 font-bold text-neutral-700 bg-white hover:bg-neutral-50">
                                Batalkan
                            </Button>
                        </Link>
                        <Button 
                            className="h-11 px-6 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 font-bold text-white flex gap-2"
                            onClick={handleSave}
                        >
                            <UserPlus className="h-4 w-4" />
                            Simpan Karyawan
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
                                <span className="text-[#64748B] text-[14px] font-medium mt-0.5">Data Karyawan Berhasil di Tambahkan</span>
                            </div>
                        </div>
                        <button onClick={() => setShowSuccessToast(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

EmployeesCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Karyawan', href: '/admin/employees' },
        { title: 'Tambah Karyawan', href: '/admin/employees/create' }
    ]}>
        {page}
    </AppLayout>
);
