import { usePage } from '@inertiajs/react';
import { Search, User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

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

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-sucofindo-primary focus:ring-1 focus:ring-sucofindo-primary/30 transition-colors"
                    />
                </div>
            </div>

            {/* Right: User Avatar */}
            <div className="flex items-center">
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors">
                    <User className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}

