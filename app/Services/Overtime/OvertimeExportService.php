<?php

namespace App\Services\Overtime;

use App\Models\Employee;
use App\Models\Holiday;
use App\Models\Overtime;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class OvertimeExportService
{
    protected OvertimeCalculationService $calcService;

    public function __construct(OvertimeCalculationService $calcService)
    {
        $this->calcService = $calcService;
    }

    public function export(string $startDate, string $endDate, ?int $projectId = null)
    {
        $templatePath = storage_path('app/templates/Format_Rekap_Lembur_HRD_Usulan.xlsx');
        if (!file_exists($templatePath)) {
            throw new \Exception('Template Excel tidak ditemukan di ' . $templatePath);
        }

        $spreadsheet = IOFactory::load($templatePath);

        // 1. Sheet Master Karyawan
        $this->fillMasterKaryawan($spreadsheet->getSheetByName('Master Karyawan'), $projectId);

        // 2. Sheet Kalender Libur
        $this->fillKalenderLibur($spreadsheet->getSheetByName('Kalender Libur'), $startDate, $endDate);

        // Fetch Overtimes
        $query = Overtime::with(['employee.user', 'employee.projects', 'employee.salaries'])
            ->whereBetween('date', [$startDate, $endDate])
            ->where('status', 'approved')
            ->orderBy('date', 'asc');

        if ($projectId) {
            $query->whereHas('employee.projects', function ($q) use ($projectId) {
                $q->where('projects.id', $projectId);
            });
        }

        $overtimes = $query->get();

        // 3. Sheet Data Lembur (Detail)
        $rekapData = $this->fillDataLembur($spreadsheet->getSheetByName('Data Lembur (Detail)'), $overtimes);

        // 4. Sheet Rekap Pendanaan
        $this->fillRekapPendanaan($spreadsheet->getSheetByName('Rekap Pendanaan'), $rekapData);

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'rekap_lembur');
        $writer->save($tempFile);

        return $tempFile;
    }

    protected function fillMasterKaryawan($sheet, ?int $projectId = null)
    {
        if (!$sheet) return;

        // Ambil data pegawai aktif (bukan magang)
        $query = Employee::with(['user', 'projects', 'salaries'])
            ->whereHas('user', function ($q) {
                $q->where('role', '!=', 'intern')->where('is_active', true);
            });

        if ($projectId) {
            $query->whereHas('projects', function ($q) use ($projectId) {
                $q->where('projects.id', $projectId);
            });
        }

        $employees = $query->get();

        $row = 5;
        foreach ($employees as $employee) {
            $sheet->setCellValue('A' . $row, $employee->nik ?? '-');
            $sheet->setCellValue('B' . $row, $employee->user->name ?? '-');
            $sheet->setCellValue('C' . $row, $employee->division ?? '-');
            $sheet->setCellValue('D' . $row, $employee->activeProject()?->name ?? '-');
            
            $salary = $employee->activeSalary()?->base_salary ?? 0;
            $sheet->setCellValue('E' . $row, $salary);
            $row++;
        }
    }

    protected function fillKalenderLibur($sheet, $start, $end)
    {
        if (!$sheet) return;

        $holidays = Holiday::whereBetween('date', [$start, $end])->orderBy('date', 'asc')->get();

        $row = 5;
        foreach ($holidays as $holiday) {
            $sheet->setCellValue('A' . $row, Date::PHPToExcel(Carbon::parse($holiday->date)));
            $sheet->getStyle('A' . $row)->getNumberFormat()->setFormatCode('dd/mm/yyyy');
            $sheet->setCellValue('B' . $row, $holiday->name ?? $holiday->description);
            $row++;
        }
    }

    protected function fillDataLembur($sheet, $overtimes)
    {
        if (!$sheet) return [];

        $row = 5;
        $no = 1;

        // Map hari dalam bahasa indonesia
        $days = [
            'Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu'
        ];

        // Menyimpan data untuk sheet rekap
        // format: employee_id => [ details... ]
        $rekapData = [];

        foreach ($overtimes as $overtime) {
            $employee = $overtime->employee;
            $user = $employee->user;
            
            $date = Carbon::parse($overtime->date);
            $hari = $days[$date->englishDayOfWeek];
            
            $isHoliday = $this->calcService->isHoliday($overtime->date);
            $jenisHari = $isHoliday ? 'Libur' : 'Normal';
            
            $duration = $this->calcService->calculateDuration($overtime->start_time, $overtime->end_time);
            $rate = $this->calcService->getRate($isHoliday);
            $salary = $employee->activeSalary()?->base_salary ?? 0;
            
            $upahLembur = 0;
            if ($overtime->status === 'approved') {
                $upahLembur = $this->calcService->calculatePay($salary, $rate, $duration);
            }

            // Fill Detail
            $sheet->setCellValue('A' . $row, $no++);
            $sheet->setCellValue('B' . $row, $user->name ?? '-');
            $sheet->setCellValue('C' . $row, $employee->nik ?? '-');
            $sheet->setCellValue('D' . $row, $employee->activeProject()?->name ?? '-');
            $sheet->setCellValue('E' . $row, $overtime->description ?? '-');
            
            $sheet->setCellValue('F' . $row, Date::PHPToExcel($date));
            $sheet->getStyle('F' . $row)->getNumberFormat()->setFormatCode('dd/mm/yyyy');
            
            $sheet->setCellValue('G' . $row, $hari);
            
            // Format waktu ke string HH:MM
            $sheet->setCellValue('H' . $row, substr($overtime->start_time, 0, 5));
            $sheet->setCellValue('I' . $row, substr($overtime->end_time, 0, 5));
            
            // Format number bisa dihapus atau diset text
            $sheet->getStyle('H' . $row . ':I' . $row)->getNumberFormat()->setFormatCode('@');
            
            $sheet->setCellValue('J' . $row, $duration);
            
            $sheet->setCellValue('K' . $row, $overtime->spkl_number ?? '-');
            
            $statusLabel = match($overtime->status) {
                'approved' => 'Sudah Di-review',
                'pending' => 'Belum Di-review',
                'rejected' => 'Rejected',
                default => 'Unknown'
            };
            $sheet->setCellValue('L' . $row, $statusLabel);
            
            $sheet->setCellValue('M' . $row, $jenisHari);
            $sheet->setCellValue('N' . $row, $salary);
            $sheet->setCellValue('O' . $row, $rate);
            $sheet->setCellValue('P' . $row, $upahLembur);
            
            $ratePercent = $rate * 100;
            $rincian = "Rp" . number_format($salary, 0, ',', '.') . " x {$ratePercent}% x {$duration} jam = Rp" . number_format($upahLembur, 0, ',', '.');
            if ($overtime->status !== 'approved') {
                $rincian = "Tidak Dihitung (Status: {$statusLabel})";
            }
            $sheet->setCellValue('Q' . $row, $rincian);

            // Copy styling if needed or rely on template's entire column style
            
            // Accumulate for Rekap
            if ($overtime->status === 'approved') {
                if (!isset($rekapData[$employee->id])) {
                    $rekapData[$employee->id] = [
                        'nik' => $employee->nik,
                        'name' => $user->name,
                        'normal_hours' => 0,
                        'holiday_hours' => 0,
                        'normal_pay' => 0,
                        'holiday_pay' => 0,
                    ];
                }
                
                if ($isHoliday) {
                    $rekapData[$employee->id]['holiday_hours'] += $duration;
                    $rekapData[$employee->id]['holiday_pay'] += $upahLembur;
                } else {
                    $rekapData[$employee->id]['normal_hours'] += $duration;
                    $rekapData[$employee->id]['normal_pay'] += $upahLembur;
                }
            }
            
            $row++;
        }

        return $rekapData;
    }

    protected function fillRekapPendanaan($sheet, $rekapData)
    {
        if (!$sheet) return;

        $row = 5;
        $no = 1;
        $grandTotal = 0;

        foreach ($rekapData as $data) {
            $totalPay = $data['normal_pay'] + $data['holiday_pay'];
            
            $sheet->setCellValue('A' . $row, $no++);
            $sheet->setCellValue('B' . $row, $data['nik']);
            $sheet->setCellValue('C' . $row, $data['name']);
            $sheet->setCellValue('D' . $row, $data['normal_hours']);
            $sheet->setCellValue('E' . $row, $data['holiday_hours']);
            $sheet->setCellValue('F' . $row, $data['normal_pay']);
            $sheet->setCellValue('G' . $row, $data['holiday_pay']);
            $sheet->setCellValue('H' . $row, $totalPay);
            
            $grandTotal += $totalPay;
            $row++;
        }

        // Add Grand Total row
        $sheet->setCellValue('G' . ($row + 1), 'GRAND TOTAL PENDANAAN LEMBUR');
        $sheet->setCellValue('H' . ($row + 1), $grandTotal);
        $sheet->getStyle('G' . ($row + 1) . ':H' . ($row + 1))->getFont()->setBold(true);
    }
}
