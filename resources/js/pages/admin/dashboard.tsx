import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import {
    Building2,
    CalendarCheck,
    ChevronLeft,
    ChevronRight,
    Clock,
    LogIn as LogInIcon,
    MoreHorizontal,
    Search,
    UserMinus,
    UserPlus,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

// ─── Static Data ────────────────────────────────────────────────────────────

const today = new Date();
const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}).format(today);

// ─── Types ─────────────────────────────────────────────────────────────────

interface KPIProps {
    totalPtt: number;
    totalInterns: number;
    checkedInToday: number;
    overtimeToday: number;
}

interface AdminDashboardProps {
    kpi: KPIProps;
    attendanceTrendData: { day: string; value: number }[];
    workModeData: { name: string; value: number; color: string }[];
    attendanceRecords: {
        id: number;
        name: string;
        employeeId: string;
        role: string;
        avatar: string | null;
        avatarColor: string;
        project: string;
        clockIn: string;
        clockInLate: boolean;
        clockOut: string;
        status: string;
        statusColor: string;
        mode: string;
        modeBorder: string;
        notes: string | null;
    }[];
    filters?: {
        per_page?: string | number;
    };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminDashboard(props: AdminDashboardProps) {
    const [liveData, setLiveData] = useState({
        kpi: props.kpi,
        attendanceTrendData: props.attendanceTrendData,
        workModeData: props.workModeData,
        attendanceRecords: props.attendanceRecords,
    });

    useEffect(() => {
        // Update local state if props change from Inertia navigation
        setLiveData({
            kpi: props.kpi,
            attendanceTrendData: props.attendanceTrendData,
            workModeData: props.workModeData,
            attendanceRecords: props.attendanceRecords,
        });
    }, [props]);

    useEffect(() => {
        // Buat koneksi EventSource ke endpoint stream kita
        const eventSource = new EventSource('/admin/dashboard/stream');

        eventSource.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
                if (newData && newData.kpi) {
                    setLiveData((prev) => ({
                        ...prev,
                        kpi: newData.kpi,
                        attendanceTrendData: newData.attendanceTrendData,
                        workModeData: newData.workModeData,
                        attendanceRecords: newData.attendanceRecords,
                    }));
                }
            } catch (error) {
                console.error("Gagal mem-parsing SSE data", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("EventSource error, mencoba reconnect otomatis...", error);
            // Klien browser modern otomatis me-reconnect jika terputus
        };

        return () => {
            eventSource.close(); // Tutup koneksi saat komponen unmount
        };
    }, []);

    const { kpi, attendanceTrendData, workModeData, attendanceRecords } = liveData;
    const { filters } = props;

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/admin/dashboard',
            { per_page: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const kpiCards = [
        {
            label: 'Total Karyawan PTT',
            value: kpi.totalPtt.toLocaleString(),
            icon: Users,
            iconBg: 'bg-[#E5F0F9]',
            iconBgHover: 'group-hover:bg-[#D6E4F0]',
            iconColor: 'text-[#035EA9]',
            hoverClass: 'hover:border-l-[#035EA9] hover:border-y-[#035EA9]/30 hover:border-r-[#035EA9]/30 hover:bg-[#F0F5FA]',
        },
        {
            label: 'Total Magang',
            value: kpi.totalInterns.toLocaleString(),
            icon: Users,
            iconBg: 'bg-[#E5F0F9]',
            iconBgHover: 'group-hover:bg-[#D6E4F0]',
            iconColor: 'text-[#035EA9]',
            hoverClass: 'hover:border-l-[#035EA9] hover:border-y-[#035EA9]/30 hover:border-r-[#035EA9]/30 hover:bg-[#F0F5FA]',
        },
        {
            label: 'Hadir Hari Ini',
            value: kpi.checkedInToday.toLocaleString(),
            icon: LogInIcon,
            iconBg: 'bg-[#DCFCE7]',
            iconBgHover: 'group-hover:bg-[#BBF7D0]',
            iconColor: 'text-[#22C55E]',
            hoverClass: 'hover:border-l-[#22C55E] hover:border-y-[#22C55E]/30 hover:border-r-[#22C55E]/30 hover:bg-[#F0FDF4]',
        },
        {
            label: 'Lembur',
            value: kpi.overtimeToday.toLocaleString(),
            icon: Clock,
            iconBg: 'bg-[#FEF9C3]',
            iconBgHover: 'group-hover:bg-[#FEF08A]',
            iconColor: 'text-[#EAB308]',
            hoverClass: 'hover:border-l-[#EAB308] hover:border-y-[#EAB308]/30 hover:border-r-[#EAB308]/30 hover:bg-[#FEFCE8]',
        },
    ];

    // ─── Component ──────────────────────────────────────────────────────────────


    const attendanceChartConfig = {
        value: {
            label: "Kehadiran",
            color: "#035EA9",
        }
    };

    const workModeChartConfig = {
        value: {
            label: "Total",
            color: "#035EA9",
        }
    };

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-sucofindo-light p-6 font-mulish">
                {/* ── Section Header ────────────────────────────────── */}
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">
                        Ringkasan Hari ini
                    </h1>
                    <p className="mt-0.5 text-sm text-neutral-500">
                        {formattedDate}
                    </p>
                </div>

                {/* ── KPI Cards ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((card) => (
                        <div
                            key={card.label}
                            className={`group relative overflow-hidden rounded-xl border border-neutral-200 border-l-4 border-l-transparent bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${card.hoverClass}`}
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 leading-tight">
                                        {card.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-neutral-900">
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${card.iconBg} ${card.iconBgHover}`}
                                >
                                    <card.icon
                                        className={`h-4 w-4 ${card.iconColor}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Charts Section ────────────────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                    {/* Tren Kehadiran (Line Chart) */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-neutral-800">
                                Tren Kehadiran (Minggu Ini)
                            </h2>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="h-[280px] w-full">
                            <ChartContainer config={attendanceChartConfig} className="h-full w-full">
                                <AreaChart data={attendanceTrendData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: '#9CA3AF',
                                        }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: '#9CA3AF',
                                        }}
                                        domain={[0, 'dataMax + 10']}
                                        allowDecimals={false}
                                        dx={-10}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent />}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--color-value)"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        activeDot={{
                                            fill: 'var(--color-value)',
                                            stroke: 'white',
                                            strokeWidth: 2,
                                            r: 7,
                                        }}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Mode Kerja (Donut Chart) */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-neutral-800">
                            Mode Kerja
                        </h2>
                        <div className="flex h-[220px] items-center justify-center">
                            <ChartContainer config={workModeChartConfig} className="h-full w-full">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={workModeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        dataKey="value"
                                        nameKey="name"
                                        strokeWidth={0}
                                    >
                                        {workModeData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ),
                                        )}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                        {/* Legend */}
                        <div className="mt-4 flex items-center justify-center gap-6">
                            {workModeData.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />
                                    <span className="text-sm text-neutral-600">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Attendance Table ──────────────────────────────── */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                    {/* Table Header */}
                    <div className="flex flex-col gap-3 border-b border-neutral-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-semibold text-neutral-800">
                            Riwayat Aktivitas Kehadiran
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Cari Karyawan..."
                                className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-sucofindo-primary focus:ring-1 focus:ring-sucofindo-primary/30 transition-colors sm:w-56"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    <th className="px-6 py-3">Karyawan</th>
                                    <th className="px-6 py-3">Proyek / Bidang</th>
                                    <th className="px-6 py-3">Clock In</th>
                                    <th className="px-6 py-3">Clock Out</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Mode</th>
                                    <th className="px-6 py-3">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {attendanceRecords.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="transition-colors hover:bg-neutral-50/50"
                                    >
                                        {/* Karyawan */}
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F0F9] text-xs font-bold text-[#035EA9]"
                                                >
                                                    {record.name
                                                        .split(' ')
                                                        .filter(Boolean)
                                                        .slice(0, 2)
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-neutral-800">
                                                        {record.name}
                                                    </p>
                                                    <p
                                                        className={`text-xs font-medium ${record.role === 'intern'
                                                                ? 'text-[#00A099]'
                                                                : 'text-[#035EA9]'
                                                            }`}
                                                    >
                                                        {record.role === 'intern'
                                                            ? 'Mahasiswa Magang'
                                                            : 'Karyawan PTT'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Projek */}
                                        <td className="px-6 py-3.5">
                                            <span
                                                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${record.role === 'intern'
                                                        ? 'bg-[#00A099]/10 text-[#00A099]'
                                                        : 'bg-[#035EA9]/10 text-[#035EA9]'
                                                    }`}
                                            >
                                                {record.project}
                                            </span>
                                        </td>

                                        {/* Clock In */}
                                        <td className="px-6 py-3.5">
                                            <span
                                                className={
                                                    record.clockInLate
                                                        ? 'font-medium text-red-500'
                                                        : 'text-neutral-600'
                                                }
                                            >
                                                {record.clockIn}
                                            </span>
                                        </td>

                                        {/* Clock Out */}
                                        <td className="px-6 py-3.5 text-neutral-600">
                                            {record.clockOut}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-3.5">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${record.statusColor}`}
                                            >
                                                {record.status}
                                            </span>
                                        </td>

                                        {/* Mode */}
                                        <td className="px-6 py-3.5">
                                            <span
                                                className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-medium ${record.modeBorder}`}
                                            >
                                                {record.mode}
                                            </span>
                                        </td>

                                        {/* Catatan */}
                                        <td className="px-6 py-3.5 text-neutral-400">
                                            {record.notes || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-100 px-6 py-4 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <select
                                value={filters?.per_page || 10}
                                onChange={handlePerPageChange}
                                className="h-8 rounded-md border-neutral-300 text-xs text-neutral-600 focus:ring-[#035EA9] focus:border-[#035EA9] bg-white shadow-sm"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <p className="text-xs text-neutral-500 font-medium">
                                Menampilkan {attendanceRecords.length} entri terbaru
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-sucofindo-primary text-white text-xs font-medium">
                                1
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 text-xs font-medium transition-colors">
                                2
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 text-xs font-medium transition-colors">
                                3
                            </button>
                            <span className="px-1 text-xs text-neutral-400">
                                ...
                            </span>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};
