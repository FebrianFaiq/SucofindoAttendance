import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, UserPlus, GraduationCap, Briefcase } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface Project {
    id: number;
    name: string;
    code: string;
}

interface EmployeesCreateProps {
    projects: Project[];
}

export default function EmployeesCreate({ projects }: EmployeesCreateProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nik: '',
        email: '',
        phone: '',
        role: 'employee',
        division: 'BIT',
        project_id: '',
        is_active: true,
        base_salary: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/employees');
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
                        Masukkan detailnya untuk membuat catatan pegawai atau mahasiswa magang baru di sistem.
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
                                        placeholder="Contoh: Budi Santoso" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">
                                        NIK <span className="text-red-500">*</span>
                                    </label>
                                    <Input 
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={16}
                                        value={data.nik}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setData('nik', val);
                                        }}
                                        placeholder="Contoh: 3201123456780001" 
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
                                        placeholder="Contoh: budi@sucofindo.com" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Nomor Telepon</label>
                                    <Input 
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={15}
                                        value={data.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setData('phone', val);
                                        }}
                                        placeholder="Contoh: 081234567890" 
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone}</p>}
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] w-full bg-neutral-200"></div>

                        {/* 2. Rincian & Tipe Pegawai */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Rincian & Tipe Pegawai</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* Tipe Pegawai */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">
                                        Tipe / Kategori Pegawai <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'employee')}
                                            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                                                data.role === 'employee'
                                                    ? 'border-[#035EA9] bg-[#E5F0F9]/50 text-[#035EA9] font-bold shadow-sm'
                                                    : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 font-semibold hover:bg-neutral-100'
                                            }`}
                                        >
                                            <Briefcase className="h-4 w-4 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-xs">Karyawan PTT</span>
                                                <span className="text-[10px] font-normal text-neutral-500">Absen & Lembur</span>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'intern')}
                                            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                                                data.role === 'intern'
                                                    ? 'border-[#035EA9] bg-[#E5F0F9]/50 text-[#035EA9] font-bold shadow-sm'
                                                    : 'border-neutral-200 bg-[#F8FAFC] text-neutral-600 font-semibold hover:bg-neutral-100'
                                            }`}
                                        >
                                            <GraduationCap className="h-4 w-4 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-xs">Mahasiswa Magang</span>
                                                <span className="text-[10px] font-normal text-neutral-500">Hanya Kehadiran</span>
                                            </div>
                                        </button>
                                    </div>
                                    {errors.role && <p className="text-xs text-red-500 font-semibold">{errors.role}</p>}
                                </div>

                                {/* Kondisional: Proyek untuk Employee vs Bidang untuk Intern */}
                                {data.role === 'intern' ? (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] font-bold text-[#1E293B]">
                                            Bidang / Divisi Penempatan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.division}
                                            onChange={(e) => setData('division', e.target.value)}
                                            className="h-11 w-full rounded-md border border-neutral-200 bg-[#F8FAFC] px-3 font-semibold text-neutral-800 shadow-sm focus:border-[#035EA9] focus:outline-none focus:ring-1 focus:ring-[#035EA9]"
                                        >
                                            <option value="LSI">LSI (Layanan Sertifikasi & Inspeksi)</option>
                                            <option value="DukBis">DukBis (Dukungan Bisnis)</option>
                                            <option value="BIT">BIT (Bisnis & Informasi Teknologi)</option>
                                            <option value="KSP">KSP (Konsultasi & Solusi Perusahaan)</option>
                                        </select>
                                        {errors.division && <p className="text-xs text-red-500 font-semibold">{errors.division}</p>}
                                        <p className="text-xs text-neutral-500">
                                            Mahasiswa magang ditempatkan berdasarkan Bidang kerja, bukan proyek.
                                        </p>
                                    </div>
                                ) : (
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
                                )}

                                {/* Gaji Pokok (hanya untuk karyawan PTT) */}
                                {data.role === 'employee' && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] font-bold text-[#1E293B]">
                                            Gaji Pokok (Bulanan) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold text-sm">Rp</span>
                                            <Input
                                                type="number"
                                                value={data.base_salary}
                                                onChange={(e) => setData('base_salary', e.target.value)}
                                                placeholder="Contoh: 4500000"
                                                className="h-11 pl-10 bg-[#F8FAFC] border-neutral-200 text-[#1E293B] font-semibold focus-visible:ring-[#035EA9]"
                                            />
                                        </div>
                                        {errors.base_salary && <p className="text-xs text-red-500 font-semibold">{errors.base_salary}</p>}
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#1E293B]">Status Akun</label>
                                    <div className="flex items-center gap-3 mt-1.5">
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
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] w-full bg-neutral-200"></div>

                        {/* 3. Keamanan */}
                        <section className="flex flex-col gap-5">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">Keamanan</h2>
                            
                            <div className="flex flex-col gap-2 max-w-[500px]">
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
                                    Password awal diset ke bawaan (<b>123</b>). Karyawan dapat mengganti password setelah login.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* ── Footer Actions ─────────────────────────────────── */}
                    <div className="border-t border-neutral-200 bg-[#F8FAFC] p-6 rounded-b-xl flex justify-end gap-4">
                        <Link href="/admin/employees">
                            <Button type="button" variant="outline" className="h-11 px-6 border-neutral-300 font-bold text-neutral-700 bg-white hover:bg-neutral-50">
                                Batalkan
                            </Button>
                        </Link>
                        <Button 
                            type="submit"
                            disabled={processing}
                            className="h-11 px-6 bg-[#0B3B8B] hover:bg-[#0B3B8B]/90 font-bold text-white flex gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                        </Button>
                    </div>
                </form>
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
