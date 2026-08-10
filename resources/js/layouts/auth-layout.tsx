import AuthSucofindoLayout from '@/layouts/auth/auth-sucofindo-layout';

export default function AuthLayout({
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthSucofindoLayout>
            {children}
        </AuthSucofindoLayout>
    );
}
