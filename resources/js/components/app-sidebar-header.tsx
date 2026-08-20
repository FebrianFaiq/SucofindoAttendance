import { usePage } from '@inertiajs/react';
import { Search, User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import type { BreadcrumbItem as BreadcrumbItemType, User as UserType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left: Trigger + Breadcrumbs */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>



            {/* Right: User Avatar */}
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors outline-none">
                            <User className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-lg mt-1">
                        <UserMenuContent user={auth.user as UserType} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

