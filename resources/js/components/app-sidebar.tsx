import { Link, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    Clock,
    FolderKanban,
    History,
    LayoutGrid,
    LogIn,
    LogOut,
    LogOut as LogOutIcon,
    Settings,
    User as UserIcon,
    Users,
    Sparkles,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { logout } from '@/routes';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
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

    // Menu Navigasi untuk Employee / Intern
    const allEmployeeNavItems: (NavItem & { internAllowed?: boolean })[] = [
        {
            title: 'Dashboard',
            href: '/employee/dashboard',
            icon: LayoutGrid,
            internAllowed: true,
        },
        {
            title: 'Check In',
            href: '/employee/check-in',
            icon: LogIn,
            internAllowed: true,
        },
        {
            title: 'Check Out',
            href: '/employee/check-out',
            icon: LogOut,
            internAllowed: true,
        },
        {
            title: 'Lembur',
            href: '/employee/overtime',
            icon: Clock,
            internAllowed: false, // Mahasiswa magang tidak memiliki akses ke fitur lembur
        },
        {
            title: 'Riwayat Kehadiran',
            href: '/employee/history',
            icon: History,
            internAllowed: true,
        },
        {
            title: 'Profil Saya',
            href: '/employee/profile',
            icon: UserIcon,
            internAllowed: true,
        },
    ];

    const employeeNavItems = allEmployeeNavItems.filter((item) => {
        if (role === 'intern') {
            return item.internAllowed;
        }
        return true;
    });

    // Menu Navigasi untuk Admin (sesuai desain)
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Karyawan',
            href: '/admin/employees',
            icon: Users,
        },
        {
            title: 'Absensi',
            href: '/admin/attendance',
            icon: CalendarCheck,
        },
        {
            title: 'Lembur',
            href: '/admin/overtime',
            icon: Clock,
        },
        {
            title: 'Projek',
            href: '/admin/projects',
            icon: FolderKanban,
        },
    ];

    const mainNavItems = role === 'admin' ? adminNavItems : employeeNavItems;
    const dashboardUrl = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="py-3">
                <Link href={dashboardUrl} prefetch className="flex items-center justify-start w-full">
                    <img
                        src="/images/logo-sucofindo.png"
                        alt="SUCOFINDO"
                        className="h-24 w-auto object-contain"
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] font-semibold text-sm"
                        >
                            <Link href={logout().url} method="post" as="button" className="w-full flex items-center justify-start gap-2">
                                <LogOutIcon className="h-5 w-5" />
                                <span>Keluar</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
