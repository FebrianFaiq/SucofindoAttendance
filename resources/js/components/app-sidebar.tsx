import { Link, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    Clock,
    FolderKanban,
    LayoutGrid,
    LogOut as LogOutIcon,
    Users,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
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
import { logout } from '@/routes';
import type { NavItem, User } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user as User | undefined;
    const role = user?.role ?? 'employee';

    // Menu Navigasi untuk Employee / Intern (sesuai desain: Absensi + Lembur)
    const allEmployeeNavItems: (NavItem & { internAllowed?: boolean })[] = [
        {
            title: 'Absensi',
            href: '/employee/dashboard',
            icon: CalendarCheck,
            internAllowed: true,
        },
        {
            title: 'Lembur',
            href: '/employee/overtime',
            icon: Clock,
            internAllowed: false, // Mahasiswa magang tidak memiliki akses ke fitur lembur
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
