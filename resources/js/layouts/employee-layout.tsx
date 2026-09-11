import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

/**
 * Layout untuk halaman Employee.
 * Menggunakan sidebar layout yang sama dengan AppLayout,
 * nantinya sidebar navigation items akan dibedakan berdasarkan role.
 */
export default function EmployeeLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
