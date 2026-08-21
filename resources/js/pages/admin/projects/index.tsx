import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Project = {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    employees_count: number;
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    projects: PaginatedData<Project>;
    filters?: {
        search?: string;
        status?: string;
        duration?: string;
    };
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function ProjectsIndex({ projects, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [durationFilter, setDurationFilter] = useState(filters?.duration || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/projects',
            { search: searchTerm, status: statusFilter, duration: durationFilter },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        if (key === 'status') setStatusFilter(value);
        if (key === 'duration') setDurationFilter(value);
        
        router.get(
            '/admin/projects',
            { 
                search: searchTerm, 
                status: key === 'status' ? value : statusFilter, 
                duration: key === 'duration' ? value : durationFilter 
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <Head title="Proyek" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#F9F9FF] p-6 font-mulish">
                {/* ── Header ────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Proyek</h1>
                        <p className="text-neutral-500 font-medium">Kelola proyek dan penempatan karyawan</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <Link 
                            href="/admin/projects/create" 
                            className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11 px-5 flex items-center gap-2 shadow-sm rounded-xl text-xs sm:w-auto justify-center w-full whitespace-nowrap shrink-0"
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            Tambah Proyek
                        </Link>
                    </div>
                </div>

                {/* ── Control Bar & Table Container ───────────────────────────────── */}
                <div className="mt-2 flex-1 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border-b border-neutral-100 w-full">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-[400px]">
                            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama atau kode proyek..."
                                className="pl-10 h-11 rounded-lg border-neutral-300 bg-white shadow-sm focus-visible:ring-[#035EA9] font-medium"
                            />
                        </form>
                        <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
                            <Select 
                                value={statusFilter || 'all'} 
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-lg border-neutral-300 bg-white shadow-sm focus:ring-[#035EA9] font-medium text-neutral-700">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent className="font-mulish">
                                    <SelectItem value="all" className="font-medium">Semua Status</SelectItem>
                                    <SelectItem value="1" className="font-medium">Aktif</SelectItem>
                                    <SelectItem value="0" className="font-medium">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select 
                                value={durationFilter || 'all'} 
                                onValueChange={(value) => handleFilterChange('duration', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-lg border-neutral-300 bg-white shadow-sm focus:ring-[#035EA9] font-medium text-neutral-700">
                                    <SelectValue placeholder="Durasi" />
                                </SelectTrigger>
                                <SelectContent className="font-mulish">
                                    <SelectItem value="all" className="font-medium">Durasi</SelectItem>
                                    <SelectItem value="asc" className="font-medium">Terpendek</SelectItem>
                                    <SelectItem value="desc" className="font-medium">Terlama</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 bg-[#F8FAFC] text-neutral-600 whitespace-nowrap">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wide">Nama Proyek</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Kode Proyek</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Durasi</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-center">Jumlah Karyawan</th>
                                    <th className="px-6 py-4 font-bold tracking-wide">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-neutral-700">
                                {projects.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 font-medium">
                                            Tidak ada data proyek ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    projects.data.map((project) => (
                                        <tr key={project.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#035EA9]">
                                                {project.name}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-600">
                                                {project.code || '—'}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-600">
                                                {formatDate(project.start_date)} - {formatDate(project.end_date)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-900 text-center">
                                                {project.employees_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {project.is_active ? (
                                                    <Badge className="rounded-md border border-green-200 bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA]/80 px-3 py-1 text-xs font-bold shadow-none">
                                                        Aktif
                                                    </Badge>
                                                ) : (
                                                    <Badge className="rounded-md border border-neutral-200 bg-[#F1F3F4] text-[#5F6368] hover:bg-[#F1F3F4]/80 px-3 py-1 text-xs font-bold shadow-none">
                                                        Tidak Aktif
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Link 
                                                    href={`/admin/projects/${project.id}`}
                                                    className="font-bold text-[#035EA9] hover:underline text-xs"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ──────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 px-6 py-4 mt-auto">
                        <div className="text-sm font-medium text-neutral-500">
                            Menampilkan {projects.data.length > 0 ? (projects.current_page - 1) * projects.per_page + 1 : 0}-{Math.min(projects.current_page * projects.per_page, projects.total)} dari {projects.total} proyek
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {projects.links.map((link, i) => {
                                const isPrevious = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                
                                if (isPrevious) {
                                    return (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50"
                                        >
                                            &lt;
                                        </button>
                                    );
                                }
                                
                                if (isNext) {
                                    return (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50"
                                        >
                                            &gt;
                                        </button>
                                    );
                                }
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold ${
                                            link.active 
                                                ? 'bg-[#035EA9] text-white' 
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ProjectsIndex.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={[{ title: 'Proyek', href: '/admin/projects' }]}>
        {page}
    </AdminLayout>
);
