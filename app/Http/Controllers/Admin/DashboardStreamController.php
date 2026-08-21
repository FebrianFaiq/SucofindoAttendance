<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Overtime;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardStreamController extends Controller
{
    /**
     * Stream SSE data untuk Dashboard Admin (Live Update)
     */
    public function __invoke(Request $request): StreamedResponse
    {
        return response()->stream(function () use ($request) {
            // Kita batasi waktu stream misal maksimal 2 menit, setelah itu klien otomatis reconnect.
            // Ini untuk mencegah proses PHP yang hang tanpa henti di FPM.
            $startTime = time();
            $maxDuration = 120; // 2 menit
            
            while (true) {
                if (connection_aborted() || (time() - $startTime) > $maxDuration) {
                    break;
                }

                $data = $this->getDashboardData($request);
                
                // Format SSE
                echo "event: message\n";
                echo "data: " . json_encode($data) . "\n\n";
                
                // Flush buffer PHP dan server web
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
                
                // Tunggu 3 detik sebelum polling berikutnya
                sleep(3);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Disable buffering untuk Nginx
        ]);
    }

    /**
     * Ekstrak logika ambil data agar bisa direuse oleh Stream Controller
     */
    private function getDashboardData(Request $request): array
    {
        $totalPtt = Employee::whereHas('user', fn ($q) => $q->where('is_active', true)->where('role', '!=', 'intern'))->count();
        $totalInterns = Employee::whereHas('user', fn ($q) => $q->where('is_active', true)->where('role', 'intern'))->count();
        $todayAttendances = Attendance::today()->get();

        $checkedInToday = $todayAttendances->count();
        $wfoToday = $todayAttendances->where('type', 'WFO')->count();
        $wfaToday = $todayAttendances->where('type', 'WFA')->count();
        $overtimeToday = Overtime::whereDate('date', today())->count();

        // Trend Kehadiran 5 hari terakhir
        $trendData = [];
        for ($i = 4; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $count = Attendance::whereDate('check_in_at', $date)->count();
            $trendData[] = [
                'day' => $date->format('D'),
                'value' => $count,
            ];
        }

        // Mode Kerja
        $workModeData = [
            ['name' => 'WFO', 'value' => $wfoToday, 'color' => '#035EA9'],
            ['name' => 'WFA', 'value' => $wfaToday, 'color' => '#CBD5E1'],
        ];

        $perPage = $request->query('per_page', 10);

        // Riwayat Kehadiran (Recent)
        $recentAttendances = Attendance::with(['employee.user', 'employee.projects' => function ($q) {
            $q->wherePivot('status', 'active');
        }])->today()->latest('check_in_at')->limit($perPage)->get()->map(function ($attendance) {
            $checkIn = $attendance->check_in_at->timezone('Asia/Jakarta');
            $checkOut = $attendance->check_out_at?->timezone('Asia/Jakarta');

            $isIntern = $attendance->employee->user?->role === 'intern';
            $projectName = $isIntern
                ? 'Bidang: '.($attendance->employee->division ?? '-')
                : ($attendance->employee->activeProject()?->name ?? '-');

            return [
                'id' => $attendance->id,
                'name' => $attendance->employee->user->name ?? '-',
                'employeeId' => $attendance->employee->nik ?? '-',
                'avatar' => null,
                'avatarColor' => 'bg-emerald-500',
                'project' => $projectName,
                'clockIn' => $checkIn->format('H:i'),
                'clockInLate' => $checkIn->format('H:i') > '08:00',
                'clockOut' => $checkOut ? $checkOut->format('H:i') : '--:--',
                'status' => $checkOut ? 'Checked Out' : 'Checked In',
                'statusColor' => $checkOut ? 'text-[#035EA9] bg-blue-50' : 'text-emerald-600 bg-emerald-50',
                'mode' => $attendance->type,
                'modeBorder' => $attendance->type === 'WFO' ? 'border-[#035EA9] text-[#035EA9]' : 'border-[#00A099] text-[#00A099]',
                'notes' => $attendance->work_notes,
            ];
        });

        return [
            'kpi' => [
                'totalPtt' => $totalPtt,
                'totalInterns' => $totalInterns,
                'checkedInToday' => $checkedInToday,
                'overtimeToday' => $overtimeToday,
            ],
            'attendanceTrendData' => $trendData,
            'workModeData' => $workModeData,
            'attendanceRecords' => $recentAttendances,
        ];
    }
}
