import { Form, Head, Link } from '@inertiajs/react';
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
    return (
        <>
            <Head title="Masuk" />

            {/* ─── Logo SUCOFINDO ─── */}
            <div className="mb-6 flex flex-col items-center">
                {/*
                 * TODO: Ganti src di bawah dengan path logo SUCOFINDO.
                 * Contoh: src="/images/logo-sucofindo.png"
                 * Gunakan logo utama (3 globe + wordmark) dari brand guidelines.
                 */}
                <img
                    src="/images/logo-sucofindo.png"
                    alt="SUCOFINDO"
                    className="h-28 w-auto object-contain translate-x-2"
                />
            </div>

            {/* ─── Heading ─── */}
            <h1 className="mb-8 text-center font-mulish text-2xl font-extrabold tracking-wide text-sucofindo-dark">
                MASUK
            </h1>

            {/* ─── Form Login ─── */}
            <Form
                action="/login"
                method="post"
                resetOnSuccess={['password']}
                className="flex w-full max-w-sm flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Email */}
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="login-email"
                                className="font-mulish text-sm font-medium text-sucofindo-title"
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
                                className="h-11 rounded-lg border-[#D0D5DD] bg-white px-4 font-mulish text-sm text-black transition-colors focus-visible:border-sucofindo-primary focus-visible:ring-sucofindo-primary/20"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="login-password"
                                className="font-mulish text-sm font-medium text-sucofindo-title"
                            >
                                Password
                            </Label>
                            <PasswordInput
                                id="login-password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                className="h-11 rounded-lg border-[#D0D5DD] bg-white px-4 font-mulish text-sm text-black transition-colors focus-visible:border-sucofindo-primary focus-visible:ring-sucofindo-primary/20"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="mt-2 h-12 w-full rounded-lg bg-sucofindo-primary font-mulish text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-sucofindo-primary/85 hover:shadow-lg disabled:opacity-60"
                            tabIndex={3}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Login
                        </Button>

                        {/* Remember me + Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="login-remember"
                                    name="remember"
                                    tabIndex={4}
                                    className="border-[#D0D5DD] data-[state=checked]:border-sucofindo-primary"
                                />
                                <Label
                                    htmlFor="login-remember"
                                    className="cursor-pointer font-mulish text-sm font-normal text-sucofindo-title"
                                >
                                    Remember me
                                </Label>
                            </div>

                            {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="inline-flex items-center gap-1 font-mulish text-sm font-medium text-sucofindo-primary transition-colors hover:text-sucofindo-primary/80"
                                    tabIndex={5}
                                >
                                    <Lock className="size-3.5" />
                                    Forgot Password?
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </Form>

            {/* ─── Status Message (e.g. after password reset) ─── */}
            {status && (
                <div className="mt-4 text-center font-mulish text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk',
    description: 'Masuk ke akun Anda',
};
