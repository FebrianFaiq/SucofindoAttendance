<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\Project;
use App\Services\Overtime\OvertimeExportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ReportController extends Controller
{
    /**
     * Tampilkan halaman rekap kehadiran.
     * (FR-EXP-01)
     *
     * Rekap bulanan dengan filter: Karyawan, Tanggal.
     */
    public function index(Request $request): Response
    {
        $query = Attendance::with(['employee.user']);

        // Filter rentang tanggal
        if ($request->filled('date_from')) {
            $query->whereDate('check_in_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('check_in_at', '<=', $request->input('date_to'));
        }

        // Filter karyawan
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->input('employee_id'));
        }

        $attendances = $query->orderByDesc('check_in_at')->paginate(20);

        return Inertia::render('admin/reports/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['date_from', 'date_to', 'employee_id']),
        ]);
    }

    /**
     * Export rekap kehadiran ke Excel (Grid Format).
     * Sesuai request:
     * - Kolom: NIK, Nama, Projek, 1..31
     * - Tanda kehadiran: 'v'
     * - Warna header merah untuk weekend & hari libur
     * - Filter role Karyawan / Magang terpisah.
     */
    public function exportExcel(Request $request)
    {
        $role = $request->input('role', 'employee'); // 'employee' atau 'intern'

        // Coba baca parameter month & year, default ke bulan ini
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $date = Carbon::createFromDate($year, $month, 1);
        $daysInMonth = $date->daysInMonth;

        // Ambil data hari libur bulan ini
        $holidays = Holiday::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->pluck('date')
            ->map(fn ($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();

        // Ambil pegawai sesuai role
        $employees = Employee::with(['user', 'projects'])
            ->whereHas('user', function ($q) use ($role) {
                if ($role === 'intern') {
                    $q->where('role', 'intern')->where('is_active', true);
                } else {
                    $q->where('role', '!=', 'intern')->where('is_active', true);
                }
            })->get();

        // Ambil data absensi sebulan untuk pegawai tersebut
        $attendances = Attendance::whereMonth('check_in_at', $month)
            ->whereYear('check_in_at', $year)
            ->whereIn('employee_id', $employees->pluck('id'))
            ->get()
            ->groupBy(function ($item) {
                return $item->employee_id.'_'.$item->check_in_at->format('j'); // group by employee_id + tanggal (1-31)
            });

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $sheetTitle = $role === 'intern' ? 'Rekap Magang' : 'Rekap Karyawan';
        $sheet->setTitle($sheetTitle);

        // Header Row 1 (Tanggal)
        $sheet->setCellValue('A1', 'NIK');
        $sheet->setCellValue('B1', 'Nama');
        $sheet->setCellValue('C1', $role === 'intern' ? 'Bidang' : 'Projek');
        $sheet->setCellValue('D1', 'Tanggal');
        $sheet->mergeCells('D1:'.Coordinate::stringFromColumnIndex($daysInMonth + 3).'1');

        $colTotalKerja = $daysInMonth + 4;
        $colTotalLibur = $daysInMonth + 5;
        $sheet->setCellValue(Coordinate::stringFromColumnIndex($colTotalKerja).'1', 'Summary');
        $sheet->mergeCells(Coordinate::stringFromColumnIndex($colTotalKerja).'1:'.Coordinate::stringFromColumnIndex($colTotalLibur).'1');

        // Set style header utama
        $headerStyle = [
            'font' => ['bold' => true],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];

        $sheet->getStyle('A1:C2')->applyFromArray($headerStyle);
        $sheet->getStyle('D1:'.Coordinate::stringFromColumnIndex($daysInMonth + 3).'1')->applyFromArray($headerStyle);
        $sheet->getStyle(Coordinate::stringFromColumnIndex($colTotalKerja).'1:'.Coordinate::stringFromColumnIndex($colTotalLibur).'1')->applyFromArray($headerStyle);

        // Header Row 2 (Angka Tanggal 1-31 & Summary)
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $colIndex = $day + 3; // Mulai dari kolom D (4)
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->setCellValue($colLetter.'2', $day);

            // Cek warna merah (Weekend atau Libur)
            $currentDate = Carbon::createFromDate($year, $month, $day);
            $isWeekend = $currentDate->isWeekend();
            $isHoliday = in_array($currentDate->format('Y-m-d'), $holidays);

            $cellStyle = [
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ];

            if ($isWeekend || $isHoliday) {
                $cellStyle['font']['color'] = ['argb' => 'FFFF0000']; // Merah
            }

            $sheet->getStyle($colLetter.'2')->applyFromArray($cellStyle);
        }

        $sheet->setCellValue(Coordinate::stringFromColumnIndex($colTotalKerja).'2', 'Total Kehadiran (Hari Kerja)');
        $sheet->setCellValue(Coordinate::stringFromColumnIndex($colTotalLibur).'2', 'Total Kehadiran (Hari Libur)');
        $sheet->getStyle(Coordinate::stringFromColumnIndex($colTotalKerja).'2:'.Coordinate::stringFromColumnIndex($colTotalLibur).'2')->applyFromArray($headerStyle);
        $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($colTotalKerja))->setAutoSize(true);
        $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($colTotalLibur))->setAutoSize(true);

        // Isi Data
        $row = 3;
        foreach ($employees as $employee) {
            $sheet->setCellValue('A'.$row, $employee->nik ?? '-');
            $sheet->setCellValue('B'.$row, $employee->user->name ?? '-');

            // Menentukan Projek/Bidang
            if ($role === 'intern') {
                $unitKerja = $employee->division ?? '-';
            } else {
                $unitKerja = $employee->activeProject()?->name ?? '-';
            }
            $sheet->setCellValue('C'.$row, $unitKerja);

            $totalKerja = 0;
            $totalLibur = 0;

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $colLetter = Coordinate::stringFromColumnIndex($day + 3);
                $key = $employee->id.'_'.$day;

                $currentDate = Carbon::createFromDate($year, $month, $day);
                $isWeekend = $currentDate->isWeekend();
                $isHoliday = in_array($currentDate->format('Y-m-d'), $holidays);

                if ($attendances->has($key)) {
                    $sheet->setCellValue($colLetter.$row, 'v');
                    if ($isWeekend || $isHoliday) {
                        $totalLibur++;
                    } else {
                        $totalKerja++;
                    }
                }

                $sheet->getStyle($colLetter.$row)->applyFromArray([
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);
            }

            // Set Summary Values
            $sheet->setCellValue(Coordinate::stringFromColumnIndex($colTotalKerja).$row, $totalKerja);
            $sheet->setCellValue(Coordinate::stringFromColumnIndex($colTotalLibur).$row, $totalLibur);

            $sheet->getStyle(Coordinate::stringFromColumnIndex($colTotalKerja).$row.':'.Coordinate::stringFromColumnIndex($colTotalLibur).$row)->applyFromArray([
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            $sheet->getStyle('A'.$row.':C'.$row)->applyFromArray([
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            $row++;
        }

        // Auto size columns
        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);

        $writer = new Xlsx($spreadsheet);

        $filenameStr = ($role === 'intern' ? 'Rekap_Absensi_Magang_' : 'Rekap_Absensi_Karyawan_').$date->format('F_Y').'.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'excel');
        $writer->save($tempFile);

        return response()->download($tempFile, $filenameStr, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Export rekap lembur ke Excel menggunakan format template HRD.
     */
    public function exportOvertimeExcel(Request $request, OvertimeExportService $exportService)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'project_id' => 'nullable|integer|exists:projects,id',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $projectId = $request->input('project_id') ? (int) $request->input('project_id') : null;

        try {
            $tempFile = $exportService->export($startDate, $endDate, $projectId);

            $monthName = Carbon::parse($startDate)->format('F_Y');
            $projectSuffix = '';
            if ($projectId) {
                $project = Project::find($projectId);
                $projectSuffix = '_'.str_replace(' ', '_', $project->name ?? '');
            }
            $filename = "Rekap_Lembur_HRD_{$monthName}{$projectSuffix}.xlsx";

            return response()->download($tempFile, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal melakukan export: '.$e->getMessage());
        }
    }
}
