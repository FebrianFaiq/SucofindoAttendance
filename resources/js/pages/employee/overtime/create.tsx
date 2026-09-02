import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { parseISO, format } from 'date-fns';
import { Clock } from 'lucide-react';

export default function OvertimeCreate() {
    const { auth, holidays = [] } = usePage().props as any;
    const user = auth?.user || {};

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [client, setClient] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [tasks, setTasks] = useState([
        { startTime: '', endTime: '', description: '' },
        { startTime: '', endTime: '', description: '' },
        { startTime: '', endTime: '', description: '' },
        { startTime: '', endTime: '', description: '' },
    ]);

    const [processing, setProcessing] = useState(false);
    const [taskWarnings, setTaskWarnings] = useState<boolean[]>([false, false, false, false]);

    // ── Helper: hitung durasi per-task (menit) ──
    const getTaskDurationMinutes = (task: { startTime: string; endTime: string }) => {
        if (!task.startTime || !task.endTime) return 0;
        const [sh, sm] = task.startTime.split(':').map(Number);
        const [eh, em] = task.endTime.split(':').map(Number);
        let start = sh * 60 + sm;
        let end = eh * 60 + em;
        if (end < start) end += 24 * 60;
        return end - start;
    };

    // ── Helper: hitung maxEndTime per-task (clamp 4 jam = 240 menit) ──
    const getTaskMaxEndTime = (taskStartTime: string) => {
        if (!taskStartTime) return endTime;
        const [sh, sm] = taskStartTime.split(':').map(Number);
        if (isNaN(sh) || isNaN(sm)) return endTime;

        // 4 jam dari start task
        const maxMinutes = (sh * 60 + sm) + 240;
        const maxH = Math.floor(maxMinutes / 60) % 24;
        const maxM = maxMinutes % 60;
        const fourHourLimit = `${maxH.toString().padStart(2, '0')}:${maxM.toString().padStart(2, '0')}`;

        if (!endTime) return fourHourLimit;

        // Bandingkan dengan overtime end time, ambil yang lebih awal
        const [oeh, oem] = endTime.split(':').map(Number);
        if (isNaN(oeh) || isNaN(oem)) return fourHourLimit;

        const taskStart = sh * 60 + sm;
        let overtimeEndMin = oeh * 60 + oem;
        let fourHourMax = maxMinutes;

        // Handle overnight (misal lembur 22:00 - 06:00)
        if (overtimeEndMin < taskStart) overtimeEndMin += 24 * 60;
        if (fourHourMax < taskStart) fourHourMax += 24 * 60;

        return fourHourMax <= overtimeEndMin ? fourHourLimit : endTime;
    };

    const durationMinutes = (() => {
        if (!startTime || !endTime) return 0;
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const start = startHour * 60 + startMinute;
        let end = endHour * 60 + endMinute;
        if (end < start) end += 24 * 60;
        return end - start;
    })();

    const durationDisplay = (() => {
        if (!startTime || !endTime) return '0 Jam 0 Menit';
        const h = Math.floor(durationMinutes / 60);
        const m = durationMinutes % 60;
        return `${h} Jam ${m} Menit`;
    })();

    let warningMessage = '';
    if (durationMinutes > 0 && date) {
        const d = parseISO(date);
        const day = d.getDay(); // 0 is Sunday, 6 is Saturday
        const isWeekendDay = day === 0 || day === 6;

        const durationHours = durationMinutes / 60;
        if (isWeekendDay && durationHours > 9) {
            warningMessage = 'Melebihi batas durasi lembur yang telah ditetapkan';
        } else if (!isWeekendDay && durationHours > 3) {
            warningMessage = 'Melebihi batas durasi lembur yang telah ditetapkan';
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi: pastikan tidak ada task yang melebihi 4 jam
        const overLimitTask = tasks.find(t => {
            if (!t.startTime || !t.endTime) return false;
            return getTaskDurationMinutes(t) > 240;
        });
        if (overLimitTask) {
            alert('Terdapat form deskripsi pekerjaan yang melebihi 4 jam. Silakan koreksi terlebih dahulu.');
            return;
        }

        setProcessing(true);

        let taskListStr = tasks
            .filter(t => t.description.trim() !== '')
            .map((t, i) => `${i + 1}. [${t.startTime || '?'} - ${t.endTime || '?'}] ${t.description}`)
            .join('\n');

        let finalDescription = taskListStr;
        if (location || client || orderNumber) {
            finalDescription = `[Lokasi: ${location || '-'} | Klien: ${client || '-'} | No Order: ${orderNumber || '-'}]\n\nPekerjaan:\n${taskListStr}`;
        } else if (taskListStr) {
            finalDescription = `Pekerjaan:\n${taskListStr}`;
        }

        router.post('/employee/overtime', {
            date,
            start_time: startTime,
            end_time: endTime,
            description: finalDescription,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Input Lembur" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F9F9FF] p-6 font-mulish">
                {/* ── Header ── */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                        Pengajuan Lembur
                    </h1>
                    <p className="text-neutral-500 font-medium mt-1">
                        Isi detail lembur Anda untuk dicatat dalam sistem.
                    </p>
                </div>

                {/* ── Form Container ── */}
                <div className="w-full max-w-4xl rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-8">
                            {/* Tanggal Lembur */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Tanggal Lembur</label>
                                    <DatePicker
                                        date={date ? parseISO(date) : undefined}
                                        setDate={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')}
                                        placeholder="dd/mm/yyyy"
                                        className="w-full h-10 border-neutral-300 font-medium text-neutral-900 shadow-sm"
                                        holidays={holidays}
                                    />
                                </div>
                            </div>

                            {/* Jam & Durasi */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Jam Mulai</label>
                                    <TimePicker
                                        value={startTime}
                                        onChange={setStartTime}
                                        className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Jam Selesai</label>
                                    <TimePicker
                                        value={endTime}
                                        onChange={setEndTime}
                                        className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-neutral-800">Total Durasi</label>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={durationDisplay}
                                        className="h-10 border-neutral-200 bg-neutral-50 font-semibold text-neutral-600 shadow-none focus-visible:ring-0 cursor-not-allowed"
                                    />
                                    {warningMessage && (
                                        <p className="text-sm font-medium text-red-500 mt-1">
                                            {warningMessage}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tempat Kerja Lembur */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-800">
                                    Tempat Kerja Lembur <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: Kantor Pusat, Site Bekasi, dsb."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                    className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm placeholder:text-neutral-400 placeholder:font-normal"
                                />
                            </div>

                            {/* Nama Pelanggan */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-800">Nama Pelanggan (Jika Ada)</label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: PT Pertamina, Internal, dsb."
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                    className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm placeholder:text-neutral-400 placeholder:font-normal"
                                />
                            </div>

                            {/* Nomor Order */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-800">Nomor Order (Jika Ada)</label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: ORD-123456"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    className="h-10 border-neutral-300 text-neutral-900 font-medium shadow-sm placeholder:text-neutral-400 placeholder:font-normal"
                                />
                            </div>

                            {/* Job Deskripsi */}
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-neutral-800">Untuk Pelaksanaan Pekerjaan (Ditulis secara rinci dan wajib diisi)</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {tasks.map((task, index) => (
                                        <div key={index} className="flex flex-col gap-3 p-4 border border-neutral-200 rounded-lg bg-neutral-50/50">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-neutral-500 w-6">#{index + 1}</span>
                                                <div className="flex items-center gap-2 flex-1">
                                                    <TimePicker
                                                        value={task.startTime}
                                                        onChange={(val) => {
                                                            const newTasks = [...tasks];
                                                            newTasks[index].startTime = val;
                                                            setTasks(newTasks);
                                                        }}
                                                        minTime={startTime}
                                                        maxTime={endTime}
                                                        placeholder="Mulai"
                                                        className="h-10 bg-white"
                                                    />
                                                    <span className="text-neutral-400">-</span>
                                                    <TimePicker
                                                        value={task.endTime}
                                                        onChange={(val) => {
                                                            const newTasks = [...tasks];
                                                            newTasks[index].endTime = val;
                                                            // Auto-fill startTime form berikutnya
                                                            if (val && index + 1 < newTasks.length && !newTasks[index + 1].startTime) {
                                                                newTasks[index + 1].startTime = val;
                                                            }
                                                            setTasks(newTasks);
                                                            // Clear warning saat input valid
                                                            if (val) {
                                                                const newWarnings = [...taskWarnings];
                                                                newWarnings[index] = false;
                                                                setTaskWarnings(newWarnings);
                                                            }
                                                        }}
                                                        onReject={() => {
                                                            const newWarnings = [...taskWarnings];
                                                            newWarnings[index] = true;
                                                            setTaskWarnings(newWarnings);
                                                        }}
                                                        minTime={task.startTime || startTime}
                                                        maxTime={getTaskMaxEndTime(task.startTime)}
                                                        placeholder={task.startTime ? `Maks. ${getTaskMaxEndTime(task.startTime)}` : 'Selesai'}
                                                        className="h-10 bg-white"
                                                    />
                                                </div>
                                            </div>
                                            {/* Durasi per-task & Warning 4 jam */}
                                            {task.startTime && task.endTime && (() => {
                                                const dur = getTaskDurationMinutes(task);
                                                const h = Math.floor(dur / 60);
                                                const m = dur % 60;
                                                return (
                                                    <div className="flex items-center gap-2 ml-9">
                                                        <span className="text-xs font-semibold text-neutral-500">
                                                            Durasi: {h} Jam {m} Menit
                                                        </span>
                                                        {dur >= 240 && (
                                                            <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                                                                — Maks. 4 jam tercapai! Gunakan form berikutnya.
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                            {/* Warning saat input ketik melebihi 4 jam */}
                                            {taskWarnings[index] && !task.endTime && (
                                                <div className="flex items-center gap-1.5 ml-9">
                                                    <span className="text-xs font-bold text-red-500">
                                                        ⚠ Input melebihi 4 jam! Maksimal 4 jam per form deskripsi pekerjaan.
                                                    </span>
                                                </div>
                                            )}
                                            <textarea
                                                placeholder={index === 0 ? "Deskripsi pekerjaan 1..." : `Deskripsi pekerjaan ${index + 1}...`}
                                                rows={2}
                                                value={task.description}
                                                onChange={(e) => {
                                                    const newTasks = [...tasks];
                                                    newTasks[index].description = e.target.value;
                                                    setTasks(newTasks);
                                                }}
                                                required={index === 0}
                                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal shadow-sm focus:border-[#035EA9] focus:outline-none focus:ring-1 focus:ring-[#035EA9] resize-y"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-neutral-100">
                            <Link
                                href="/employee/overtime"
                                className="inline-flex h-12 min-w-[130px] items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 text-[15px] font-extrabold text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                            >
                                Batal
                            </Link>


                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-[#035EA9] px-6 text-[15px] font-extrabold text-white shadow-sm hover:bg-[#035EA9]/90 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035EA9] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Submit Overtime'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

OvertimeCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Lembur', href: '/employee/overtime' },
            { title: 'Pengajuan Lembur', href: '/employee/overtime/create' },
        ]}
    >
        {page}
    </AppLayout>
);
