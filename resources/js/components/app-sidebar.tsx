import { Link, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    Clock,
    FileSpreadsheet,
    FolderKanban,
    History,
    LayoutGrid,
    LogIn,
    LogOut,
    User as UserIcon,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, User } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user as User | undefined;
    const role = user?.role ?? 'employee';

    // Menu Navigasi untuk Employee
    const employeeNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/employee/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Check In',
            href: '/employee/check-in',
            icon: LogIn,
        },
        {
            title: 'Check Out',
            href: '/employee/check-out',
            icon: LogOut,
        },
        {
            title: 'Lembur',
            href: '/employee/overtime',
            icon: Clock,
        },
        {
            title: 'Riwayat Kehadiran',
            href: '/employee/history',
            icon: History,
        },
        {
            title: 'Profil Saya',
            href: '/employee/profile',
            icon: UserIcon,
        },
    ];

    // Menu Navigasi untuk Admin
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard Admin',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Manajemen Karyawan',
            href: '/admin/employees',
            icon: Users,
        },
        {
            title: 'Manajemen Proyek',
            href: '/admin/projects',
            icon: FolderKanban,
        },
        {
            title: 'Data Kehadiran',
            href: '/admin/attendance',
            icon: CalendarCheck,
        },
        {
            title: 'Monitoring Lembur',
            href: '/admin/overtime',
            icon: Clock,
        },
        {
            title: 'Rekap & Export',
            href: '/admin/reports',
            icon: FileSpreadsheet,
        },
    ];

    const mainNavItems = role === 'admin' ? adminNavItems : employeeNavItems;
    const dashboardUrl = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
