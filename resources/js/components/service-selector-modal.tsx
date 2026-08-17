import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/types';

/**
 * Modal pemilih layanan yang muncul saat pertama kali karyawan
 * mengakses dashboard setelah login.
 * Menyimpan pilihan di sessionStorage agar tidak muncul kembali selama sesi.
 */
export function ServiceSelectorModal() {
    const [open, setOpen] = useState(false);
    const page = usePage();
    const user = page.props.auth?.user as User | undefined;

    useEffect(() => {
        const hasSelected = sessionStorage.getItem('sucofindo_service_selected');
        if (!hasSelected) {
            setOpen(true);
        }
    }, []);

    const handleSelect = (service: 'absensi' | 'lembur') => {
        sessionStorage.setItem('sucofindo_service_selected', service);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="max-w-[560px] rounded-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-[560px] [&>button]:hidden"
            >
                <DialogTitle className="sr-only">Pilih Layanan</DialogTitle>

                {/* Header */}
                <div className="flex flex-col items-center pt-10 pb-2 px-8">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#035EA9] mb-3">
                        SUCOFINDO
                    </span>
                    <h2 className="text-2xl md:text-[28px] font-extrabold text-[#14141A] text-center leading-tight font-['Mulish',sans-serif]">
                        Selamat datang,
                        <br />
                        {user?.name ?? 'Rekan'} 👋
                    </h2>
                    <p className="mt-3 text-sm text-[#6B7280] text-center max-w-[380px] leading-relaxed">
                        Silakan pilih layanan yang ingin Anda akses hari ini untuk
                        memulai aktivitas Anda.
                    </p>
                </div>

                {/* Cards */}
                <div className="px-8 pb-10 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Card Absensi */}
                        <div className="relative flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all hover:border-[#035EA9]/30 hover:shadow-md overflow-hidden group">
                            {/* Decorative blob */}
                            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#F3F4F6] opacity-60 transition-transform group-hover:scale-110" />

                            <div className="relative z-10">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6]">
                                    <CalendarCheck className="h-6 w-6 text-[#6B7280]" />
                                </div>
                                <h3 className="text-base font-bold text-[#035EA9] mb-2 font-['Mulish',sans-serif]">
                                    Absensi
                                </h3>
                                <p className="text-xs text-[#6B7280] leading-relaxed mb-5">
                                    Kelola kehadiran harian, pantau jam kerja, dan tinjau riwayat absensi
                                    Anda secara real-time.
                                </p>
                            </div>

                            <button
                                onClick={() => handleSelect('absensi')}
                                className="relative z-10 w-full rounded-lg bg-[#035EA9] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#024a87] cursor-pointer"
                            >
                                Buka Absensi
                            </button>
                        </div>

                        {/* Card Lembur */}
                        <div className="relative flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all hover:border-[#035EA9]/30 hover:shadow-md overflow-hidden group">
                            {/* Decorative blob */}
                            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#F3F4F6] opacity-60 transition-transform group-hover:scale-110" />

                            <div className="relative z-10">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6]">
                                    <Clock className="h-6 w-6 text-[#6B7280]" />
                                </div>
                                <h3 className="text-base font-bold text-[#035EA9] mb-2 font-['Mulish',sans-serif]">
                                    Lembur
                                </h3>
                                <p className="text-xs text-[#6B7280] leading-relaxed mb-5">
                                    Ajukan permohonan lembur dan pantau status persetujuan dengan
                                    sistem yang terintegrasi.
                                </p>
                            </div>

                            <Link
                                href="/employee/overtime"
                                onClick={() => handleSelect('lembur')}
                                className="relative z-10 w-full rounded-lg border border-[#D1D5DB] bg-white py-2.5 text-center text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB] cursor-pointer block"
                            >
                                Buka Lembur
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
