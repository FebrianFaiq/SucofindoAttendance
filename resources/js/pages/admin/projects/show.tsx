import { Head, Link, useForm, router } from '@inertiajs/react';
import { format, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit2, Search, UserPlus, Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';

type Employee = {
    id: number;
    nik: string;
    user?: {
        name: string;
        email: string;
        role: string;
        is_active: boolean;
    };
    pivot?: {
        id?: number;
        status: string;
    };
};

type AvailableEmployee = {
    id: number;
    nik: string;
    user?: {
        name: string;
        email: string;
    };
    projects?: {
        id: number;
        pivot: {
            status: string;
        };
    }[];
};

type Project = {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    employees?: Employee[];
};

type Props = {
    project: Project;
    availableEmployees?: AvailableEmployee[];
};

export default function ProjectShow({ project, availableEmployees = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter employees locally for the table
    const filteredEmployees = (project.employees || []).filter(emp => {
        const term = searchTerm.toLowerCase();
        const nameMatch = emp.user?.name.toLowerCase().includes(term) ?? false;
        const nikMatch = emp.nik.toLowerCase().includes(term);
        const emailMatch = emp.user?.email.toLowerCase().includes(term) ?? false;

        return nameMatch || nikMatch || emailMatch;
    });

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    // Helpers
    const getInitials = (name?: string) => {
        if (!name) {
return 'UN';
}

        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
return '';
}

        return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
    };

    // Calculate progress and days left
    const today = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    
    let progress = 0;
    let daysLeft = 0;
    
    if (today >= endDate) {
        progress = 100;
        daysLeft = 0;
    } else if (today <= startDate) {
        progress = 0;
        daysLeft = differenceInDays(endDate, startDate);
    } else {
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = today.getTime() - startDate.getTime();
        progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
        daysLeft = differenceInDays(endDate, today);
    }

    // Assign Modal Logic
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignSearchTerm, setAssignSearchTerm] = useState('');
    
    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing, reset: resetAssign } = useForm({
        project_id: project.id,
        employee_ids: [] as number[],
    });

    const isAssignedToOtherProject = (emp: AvailableEmployee) => {
        return emp.projects && emp.projects.some(p => p.id !== project.id);
    };

    const isAssignedToThisProject = (emp: AvailableEmployee) => {
        return emp.projects && emp.projects.some(p => p.id === project.id);
    };

    const filteredAssignEmployees = availableEmployees.filter(emp => {
        const isAssignedToThis = isAssignedToThisProject(emp);
        const hasNoProjects = !emp.projects || emp.projects.length === 0;

        if (!isAssignedToThis && !hasNoProjects) {
            return false;
        }

        const term = assignSearchTerm.toLowerCase();
        const nameMatch = emp.user?.name.toLowerCase().includes(term) ?? false;
        const nikMatch = emp.nik.toLowerCase().includes(term);

        return nameMatch || nikMatch;
    });

    const openAssignModal = () => {
        const currentlyAssignedIds = availableEmployees
            .filter(emp => isAssignedToThisProject(emp))
            .map(emp => emp.id);
        setAssignData('employee_ids', currentlyAssignedIds);
        setIsAssignModalOpen(true);
    };

    const handleToggleEmployee = (empId: number) => {
        const current = assignData.employee_ids;

        if (current.includes(empId)) {
            setAssignData('employee_ids', current.filter(id => id !== empId));
        } else {
            setAssignData('employee_ids', [...current, empId]);
        }
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAssign('/admin/assignments', {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                resetAssign();
                setAssignSearchTerm('');
            }
        });
    };

    return (
        <>
            <Head title={`Detail Proyek - ${project.name}`} />
            <div className="flex h-full flex-1 flex-col bg-[#F9F9FF] p-8 font-mulish">
                
                {/* ── Header ────────────────────────────────────────── */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-[32px] font-extrabold text-[#14141A] tracking-tight">
                            Detail Proyek
                        </h1>
                        <p className="text-neutral-500 font-medium text-[15px] mt-1">
                            Manage project details and assigned personnel.
                        </p>
                    </div>
                    
                    <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button variant="outline" className="h-11 px-5 border-neutral-300 font-bold text-[#14141A] rounded-xl flex items-center gap-2 shadow-sm bg-white hover:bg-neutral-50">
                            <Edit2 className="h-4 w-4" />
                            Edit Proyek
                        </Button>
                    </Link>
                </div>

                {/* ── Top Stats Cards ────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Card 1: Nama Proyek */}
                    <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden flex flex-col gap-3">
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-blue-50/50 rounded-l-full transform translate-x-10 pointer-events-none"></div>
                        <span className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">Nama Proyek</span>
                        <h2 className="text-[22px] font-extrabold text-[#14141A] leading-tight pr-12 relative z-10">
                            {project.name}
                        </h2>
                        <div className="mt-auto pt-2">
                            <Badge variant="outline" className="bg-neutral-50 text-neutral-600 font-bold border-neutral-200 shadow-none px-3 py-1">
                                # {project.code || 'NO-CODE'}
                            </Badge>
                        </div>
                    </div>

                    {/* Card 2: Status Proyek */}
                    <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col gap-3">
                        <span className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">Status Proyek</span>
                        <div className="flex items-center gap-2">
                            {project.is_active ? (
                                <>
                                    <div className="h-3 w-3 rounded-full bg-[#00A099]"></div>
                                    <span className="text-[22px] font-extrabold text-[#14141A]">Aktif</span>
                                </>
                            ) : (
                                <>
                                    <div className="h-3 w-3 rounded-full bg-neutral-400"></div>
                                    <span className="text-[22px] font-extrabold text-[#14141A]">Tidak Aktif</span>
                                </>
                            )}
                    </div>
                </div>

                    {/* Card 3: Durasi & Timeline */}
                    <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col gap-3">
                        <span className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">Durasi & Timeline</span>
                        <div className="flex items-start gap-3 mt-1">
                            <Calendar className="h-6 w-6 text-[#035EA9] shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-bold text-[#14141A] text-[15px]">{formatDate(project.start_date)}</span>
                                <span className="text-sm font-medium text-neutral-500">s/d {formatDate(project.end_date)}</span>
                            </div>
                        </div>
                        <div className="mt-auto pt-2">
                            <Badge variant="outline" className="bg-[#F8FAFC] text-neutral-600 font-bold border-neutral-200 shadow-none px-3 py-1 flex items-center gap-1.5 w-max">
                                <Clock className="h-3.5 w-3.5" />
                                {daysLeft > 0 ? `${daysLeft} Hari Tersisa` : 'Waktu Habis'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* ── Table Karyawan dalam Proyek ──────────────────── */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                    {/* Table Header */}
                    <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100">
                        <div className="flex flex-col">
                            <h2 className="text-[20px] font-bold text-[#14141A]">Karyawan dalam Proyek</h2>
                            <p className="text-[14px] text-neutral-500 font-medium">Daftar personil yang ditugaskan pada proyek ini.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative w-full sm:w-[280px]">
                                <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Cari karyawan..."
                                    className="pl-9 h-11 border-neutral-200 bg-white shadow-sm focus-visible:ring-[#035EA9] font-medium"
                                />
                            </div>
                            <Button 
                                onClick={openAssignModal}
                                className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11 px-5 rounded-lg flex items-center gap-2 shadow-sm whitespace-nowrap"
                            >
                                <UserPlus className="h-4 w-4" />
                                Assign Karyawan
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-[#434654] tracking-wide w-[30%]">Karyawan</th>
                                    <th className="px-6 py-4 font-bold text-[#434654] tracking-wide w-[25%]">Employee ID</th>
                                    <th className="px-6 py-4 font-bold text-[#434654] tracking-wide w-[30%]">Email</th>
                                    <th className="px-6 py-4 font-bold text-[#434654] tracking-wide w-[15%] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {paginatedEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-500 font-medium">
                                            Tidak ada karyawan yang ditugaskan di proyek ini.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEmployees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#035EA9] font-bold text-white shadow-sm">
                                                        {getInitials(emp.user?.name)}
                                                    </div>
                                                    <span className="font-bold text-[#14141A]">{emp.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-600">
                                                {emp.nik}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-600">
                                                {emp.user?.email}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {emp.pivot?.id && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin melepas karyawan ini dari proyek?')) {
                                                                router.delete(`/admin/assignments/${emp.pivot?.id}`);
                                                            }
                                                        }}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold text-xs h-8 px-3"
                                                    >
                                                        Lepas
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredEmployees.length > 0 && (
                        <div className="border-t border-neutral-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto bg-white">
                            <div className="text-sm font-medium text-neutral-500">
                                Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredEmployees.length)} dari {filteredEmployees.length} karyawan
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-neutral-200 text-neutral-600 hover:text-[#035EA9] hover:border-[#035EA9]"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="h-8 w-8 bg-[#035EA9] hover:bg-[#035EA9]/90 text-white shadow-sm"
                                >
                                    {currentPage}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-neutral-200 text-neutral-600 hover:text-[#035EA9] hover:border-[#035EA9]"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Assign Karyawan Modal ──────────────────────────── */}
                <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                    <DialogContent className="sm:max-w-[700px] p-0 font-mulish overflow-hidden border-neutral-200 bg-white">
                        
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserPlus className="h-5 w-5 text-[#035EA9]" />
                                <DialogTitle className="text-[20px] font-bold text-[#14141A]">Assign Karyawan</DialogTitle>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-6 py-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                                <Input
                                    value={assignSearchTerm}
                                    onChange={(e) => setAssignSearchTerm(e.target.value)}
                                    placeholder="Cari nama atau NIK karyawan..."
                                    className="pl-10 h-11 border-neutral-200 bg-[#F9F9FF] shadow-sm font-medium focus-visible:ring-[#035EA9]"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[40vh] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#F4F4F5] border-y border-neutral-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 w-[60px]">
                                            {/* Select all checkbox removed per user request */}
                                        </th>
                                        <th className="px-4 py-3 font-bold text-neutral-600">Nama Karyawan</th>
                                        <th className="px-4 py-3 font-bold text-neutral-600">NIK</th>
                                        <th className="px-4 py-3 font-bold text-neutral-600">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {filteredAssignEmployees.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 font-medium">
                                                Tidak ada karyawan yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAssignEmployees.map((emp) => {
                                            const otherProject = isAssignedToOtherProject(emp);
                                            const thisProject = isAssignedToThisProject(emp);
                                            const checked = assignData.employee_ids.includes(emp.id);
                                            
                                            return (
                                                <tr key={emp.id} className="hover:bg-neutral-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <Checkbox 
                                                            checked={checked}
                                                            onCheckedChange={() => handleToggleEmployee(emp.id)}
                                                            className="border-neutral-300 data-[state=checked]:bg-[#035EA9] data-[state=checked]:border-[#035EA9]"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white text-xs bg-[#035EA9]">
                                                                {getInitials(emp.user?.name)}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-[#14141A]">{emp.user?.name}</span>
                                                                {otherProject && (
                                                                    <Badge className="bg-[#F1F5F9] text-neutral-500 hover:bg-[#F1F5F9] px-2 border-none shadow-none text-[10px]">
                                                                        Di Proyek Lain
                                                                    </Badge>
                                                                )}
                                                                {thisProject && (
                                                                    <Badge className="bg-[#E6F4EA] text-[#00A099] px-2 border-none shadow-none text-[10px]">
                                                                        Di Proyek Ini
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-semibold text-neutral-500">
                                                        {emp.nik}
                                                    </td>
                                                    <td className="px-4 py-4 text-neutral-500">
                                                        {emp.user?.email}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-neutral-200 flex items-center justify-between">
                            <div className="text-[14px] font-medium text-neutral-700">
                                <span className="font-bold text-[#035EA9]">{assignData.employee_ids.length}</span> karyawan dipilih
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setIsAssignModalOpen(false);
                                        resetAssign();
                                        setAssignSearchTerm('');
                                    }}
                                    className="h-10 px-5 border-neutral-300 font-bold text-[#14141A] hover:bg-neutral-50"
                                >
                                    Batal
                                </Button>
                                <Button 
                                    onClick={handleAssignSubmit}
                                    disabled={assignProcessing}
                                    className="h-10 px-5 bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold shadow-sm"
                                >
                                    {assignProcessing ? 'Menyimpan...' : 'Simpan Penugasan'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    );
}

ProjectShow.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={[
        { title: 'Proyek', href: '/admin/projects' },
        { title: 'Detail Proyek', href: '#' }
    ]}>
        {page}
    </AdminLayout>
);
