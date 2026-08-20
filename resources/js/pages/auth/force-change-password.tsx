import { Form, Head } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import { Eye, EyeOff, KeyRound, Lock, Save } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

/**
 * Halaman Wajib Ganti Password (FR-AUTH-02)
 *
 * Ditampilkan setelah login pertama menggunakan password sementara dari Admin.
 * User tidak dapat melewati halaman ini sebelum password berhasil diganti.
 */
export default function ForceChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 350, damping: 25 },
        },
    };

    return (
        <>
            <Head title="Buat Password Baru" />

            <div className="flex min-h-screen items-center justify-center bg-[#F9F9FF] p-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-[460px] rounded-2xl border border-neutral-200 bg-white px-8 py-10 shadow-sm"
                >
                    {/* ─── Logo SUCOFINDO ─── */}
                    <motion.div variants={itemVariants} className="mb-6 flex justify-center">
                        <img
                            src="/images/logo-sucofindo.png"
                            alt="SUCOFINDO"
                            className="h-20 w-auto object-contain drop-shadow-sm"
                        />
                    </motion.div>

                    {/* ─── Heading ─── */}
                    <motion.div variants={itemVariants} className="mb-8 text-center">
                        <h1 className="font-mulish text-2xl font-black tracking-tight text-[#035EA9]">
                            Buat Password Baru
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500 font-medium leading-relaxed">
                            Demi keamanan akun Anda, silakan buat password baru
                            <br />
                            sebelum melanjutkan ke Employee Portal.
                        </p>
                    </motion.div>

                    {/* ─── Form ─── */}
                    <motion.div variants={itemVariants}>
                        <Form
                            action="/force-change-password"
                            method="post"
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Password Baru */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="fcp-password"
                                            className="font-mulish text-[13px] font-bold text-neutral-700"
                                        >
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <KeyRound className="h-4 w-4 text-neutral-400" />
                                            </div>
                                            <Input
                                                id="fcp-password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                autoFocus
                                                placeholder="Masukkan password baru"
                                                className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 pl-10 pr-10 font-mulish text-sm text-neutral-900 transition-all focus:bg-white focus-visible:border-[#035EA9] focus-visible:ring-[#035EA9]/20 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                                                tabIndex={-1}
                                                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                                            Gunakan setidaknya 8 karakter yang terdiri dari kombinasi huruf dan angka.
                                        </p>
                                        <InputError message={errors.password} className="mt-0.5" />
                                    </div>

                                    {/* Konfirmasi Password Baru */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="fcp-password-confirmation"
                                            className="font-mulish text-[13px] font-bold text-neutral-700"
                                        >
                                            Konfirmasi Password Baru
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <Lock className="h-4 w-4 text-neutral-400" />
                                            </div>
                                            <Input
                                                id="fcp-password-confirmation"
                                                type={showConfirm ? 'text' : 'password'}
                                                name="password_confirmation"
                                                required
                                                placeholder="Ulangi password baru"
                                                className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 pl-10 pr-10 font-mulish text-sm text-neutral-900 transition-all focus:bg-white focus-visible:border-[#035EA9] focus-visible:ring-[#035EA9]/20 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm((v) => !v)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                                                tabIndex={-1}
                                                aria-label={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                                            >
                                                {showConfirm ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-0.5" />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 w-full rounded-xl bg-[#0B3B8B] font-mulish text-[14px] font-bold text-white shadow-[0_4px_14px_0_rgba(11,59,139,0.25)] transition-all hover:bg-[#0a3070] hover:shadow-[0_6px_20px_rgba(11,59,139,0.3)] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                                        >
                                            {processing ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            Simpan Password & Lanjutkan
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </Form>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
