import { Form, Head, Link } from '@inertiajs/react';
import { motion  } from 'framer-motion';
import type {Variants} from 'framer-motion';
import { Lock } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
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
            transition: { type: 'spring', stiffness: 350, damping: 25 } 
        },
    };

    return (
        <>
            <Head title="Masuk" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex w-full max-w-[360px] flex-col"
            >
                {/* ─── Logo SUCOFINDO ─── */}
                <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                    <img
                        src="/images/logo-sucofindo.png"
                        alt="SUCOFINDO"
                        className="h-24 w-auto object-contain translate-x-2 drop-shadow-sm"
                    />
                </motion.div>

                {/* ─── Heading ─── */}
                <motion.div variants={itemVariants} className="mb-8 text-center">
                    <h1 className="font-mulish text-3xl font-black tracking-tight text-[#1E293B]">
                        Selamat Datang
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500 font-medium">
                        Silakan masuk untuk melanjutkan ke dashboard
                    </p>
                </motion.div>

                {/* ─── Form Login ─── */}
                <motion.div variants={itemVariants} className="w-full">
                    <Form
                        action="/login"
                        method="post"
                        resetOnSuccess={['password']}
                        className="flex w-full flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="login-email"
                                        className="font-mulish text-[13px] font-bold text-neutral-600"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Masukkan email Anda"
                                        className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 font-mulish text-sm text-neutral-900 transition-all focus:bg-white focus-visible:border-sucofindo-primary focus-visible:ring-sucofindo-primary/20 shadow-sm"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                {/* Password */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="login-password"
                                        className="font-mulish text-[13px] font-bold text-neutral-600"
                                    >
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="login-password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 font-mulish text-sm text-neutral-900 transition-all focus:bg-white focus-visible:border-sucofindo-primary focus-visible:ring-sucofindo-primary/20 shadow-sm"
                                    />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center space-x-2 mt-1">
                                    <Checkbox
                                        id="login-remember"
                                        name="remember"
                                        tabIndex={4}
                                        className="border-neutral-300 rounded data-[state=checked]:bg-sucofindo-primary data-[state=checked]:border-sucofindo-primary"
                                    />
                                    <Label
                                        htmlFor="login-remember"
                                        className="cursor-pointer font-mulish text-[13.5px] font-medium text-neutral-600 select-none"
                                    >
                                        Ingat saya di perangkat ini
                                    </Label>
                                </div>

                                {/* Login Button */}
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-3">
                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-xl bg-sucofindo-primary font-mulish text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,94,169,0.25)] transition-all hover:bg-[#024a87] hover:shadow-[0_6px_20px_rgba(3,94,169,0.3)] disabled:opacity-70 disabled:pointer-events-none"
                                        tabIndex={3}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner className="mr-2 h-4 w-4" />}
                                        Masuk
                                    </Button>
                                </motion.div>
                            </>
                        )}
                    </Form>

                    {/* ─── Status Message ─── */}
                    {status && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="mt-6 rounded-lg bg-green-50 p-4 text-center font-mulish text-sm font-medium text-green-700 border border-green-200"
                        >
                            {status}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}

Login.layout = {
    title: 'Masuk',
    description: 'Masuk ke akun Anda',
};
