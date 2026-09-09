<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeProject;
use App\Models\EmployeeSalary;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class EmployeeImportService
{
    /**
     * Generate template Excel untuk import pegawai.
     * Sheet 1: Data Pegawai (kolom-kolom untuk diisi)
     * Sheet 2: Referensi ID Projek (dari database)
     */
    public function generateTemplate(): string
    {
        $spreadsheet = new Spreadsheet;

        // ─── Sheet 1: Data Pegawai ───
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Pegawai');

        $headers = [
            'A1' => 'Nama Lengkap',
            'B1' => 'Email',
            'C1' => 'Role',
            'D1' => 'Gaji Pokok',
            'E1' => 'NIK',
            'F1' => 'Jabatan',
            'G1' => 'Bidang',
            'H1' => 'ID Projek',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Styling header
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF035EA9']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];
        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);

        // Auto-size columns
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Tambahkan baris contoh
        $sheet->setCellValue('A2', 'Contoh: Budi Santoso');
        $sheet->setCellValue('B2', 'budi@gmail.com');
        $sheet->setCellValue('C2', 'PTT Proyek');
        $sheet->setCellValue('D2', '5000000');
        $sheet->setCellValue('E2', '12345');
        $sheet->setCellValue('F2', 'Surveyor');
        $sheet->setCellValue('G2', '');
        $sheet->setCellValue('H2', '1');

        $sheet->setCellValue('A3', 'Contoh: Siti Aminah');
        $sheet->setCellValue('B3', 'siti@gmail.com');
        $sheet->setCellValue('C3', 'Magang');
        $sheet->setCellValue('D3', '1500000');
        $sheet->setCellValue('E3', '');
        $sheet->setCellValue('F3', '');
        $sheet->setCellValue('G3', 'IT Support');
        $sheet->setCellValue('H3', '');

        // Style contoh rows (italic + warna abu)
        $exampleStyle = [
            'font' => ['italic' => true, 'color' => ['argb' => 'FF999999']],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];
        $sheet->getStyle('A2:H3')->applyFromArray($exampleStyle);

        // ─── Keterangan kolom di bawah ───
        $sheet->setCellValue('A5', '📌 KETERANGAN:');
        $sheet->getStyle('A5')->getFont()->setBold(true);
        $sheet->setCellValue('A6', '- Role: Isi "PTT Proyek" atau "Magang"');
        $sheet->setCellValue('A7', '- Gaji Pokok: Angka tanpa titik/koma (contoh: 5000000)');
        $sheet->setCellValue('A8', '- NIK: Opsional untuk kedua role');
        $sheet->setCellValue('A9', '- Jabatan: Hanya untuk PTT Proyek');
        $sheet->setCellValue('A10', '- Bidang: Hanya untuk Magang');
        $sheet->setCellValue('A11', '- ID Projek: Hanya untuk PTT Proyek. Lihat Sheet "Referensi Projek" untuk daftar ID.');
        $sheet->setCellValue('A12', '- Hapus 2 baris contoh di atas sebelum mengisi data sesungguhnya.');

        // ─── Sheet 2: Referensi Projek ───
        $refSheet = $spreadsheet->createSheet();
        $refSheet->setTitle('Referensi Projek');

        $refSheet->setCellValue('A1', 'ID Projek');
        $refSheet->setCellValue('B1', 'Kode Projek');
        $refSheet->setCellValue('C1', 'Nama Projek');

        $refHeaderStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF28A745']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];
        $refSheet->getStyle('A1:C1')->applyFromArray($refHeaderStyle);

        $projects = Project::active()->orderBy('name')->get(['id', 'code', 'name']);
        $row = 2;
        foreach ($projects as $project) {
            $refSheet->setCellValue('A'.$row, $project->id);
            $refSheet->setCellValue('B'.$row, $project->code);
            $refSheet->setCellValue('C'.$row, $project->name);
            $refSheet->getStyle('A'.$row.':C'.$row)->applyFromArray([
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);
            $row++;
        }

        foreach (range('A', 'C') as $col) {
            $refSheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Set active sheet kembali ke Sheet 1
        $spreadsheet->setActiveSheetIndex(0);

        $tempFile = tempnam(sys_get_temp_dir(), 'import_template');
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return $tempFile;
    }

    /**
     * Import data pegawai dari file Excel.
     *
     * @return array{success: int, errors: array<int, string>}
     */
    public function import(UploadedFile $file): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        $successCount = 0;
        $errors = [];

        // Ambil daftar project IDs yang valid
        $validProjectIds = Project::active()->pluck('id')->toArray();

        foreach ($rows as $rowNumber => $row) {
            // Skip header row (baris 1)
            if ($rowNumber === 1) {
                continue;
            }

            $name = trim($row['A'] ?? '');
            $email = trim($row['B'] ?? '');
            $roleInput = trim($row['C'] ?? '');
            $salary = trim($row['D'] ?? '');
            $nik = trim($row['E'] ?? '');
            $jabatan = trim($row['F'] ?? '');
            $bidang = trim($row['G'] ?? '');
            $projectId = trim($row['H'] ?? '');

            // Skip baris kosong
            if ($name === '' && $email === '') {
                continue;
            }

            // Skip baris contoh
            if (str_starts_with($name, 'Contoh:')) {
                continue;
            }

            // ─── Validasi ───
            if ($name === '') {
                $errors[$rowNumber] = "Baris {$rowNumber}: Nama Lengkap wajib diisi.";
                continue;
            }

            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[$rowNumber] = "Baris {$rowNumber}: Email tidak valid atau kosong ({$email}).";
                continue;
            }

            if (User::withTrashed()->where('email', $email)->exists()) {
                $errors[$rowNumber] = "Baris {$rowNumber}: Email '{$email}' sudah terdaftar di sistem.";
                continue;
            }

            // Parse role
            $roleLower = mb_strtolower($roleInput);
            if (str_contains($roleLower, 'magang') || str_contains($roleLower, 'intern')) {
                $role = 'intern';
            } elseif (str_contains($roleLower, 'ptt') || str_contains($roleLower, 'proyek') || str_contains($roleLower, 'employee')) {
                $role = 'employee';
            } else {
                $errors[$rowNumber] = "Baris {$rowNumber}: Role '{$roleInput}' tidak dikenali. Gunakan 'PTT Proyek' atau 'Magang'.";
                continue;
            }

            // Validasi project ID untuk PTT
            $parsedProjectId = null;
            if ($role === 'employee' && $projectId !== '') {
                $parsedProjectId = (int) $projectId;
                if (! in_array($parsedProjectId, $validProjectIds)) {
                    $errors[$rowNumber] = "Baris {$rowNumber}: ID Projek '{$projectId}' tidak ditemukan di database.";
                    continue;
                }
            }

            // Validasi gaji
            $parsedSalary = $salary !== '' ? (float) str_replace(['.', ','], '', $salary) : 0;

            // ─── Simpan Data ───
            try {
                DB::transaction(function () use (
                    $name, $email, $role, $nik, $jabatan, $bidang, $parsedProjectId, $parsedSalary
                ) {
                    // 1. Buat User
                    $user = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make(User::DEFAULT_PASSWORD),
                        'role' => $role,
                        'must_change_password' => true,
                        'is_active' => true,
                    ]);

                    // 2. Buat Employee
                    $employee = Employee::create([
                        'user_id' => $user->id,
                        'nik' => $nik !== '' ? $nik : null,
                        'division' => $role === 'intern' ? ($bidang !== '' ? $bidang : null) : null,
                        'jabatan' => $role === 'employee' ? ($jabatan !== '' ? $jabatan : null) : null,
                    ]);

                    // 3. Assignment ke proyek (PTT saja)
                    if ($role === 'employee' && $parsedProjectId) {
                        EmployeeProject::create([
                            'employee_id' => $employee->id,
                            'project_id' => $parsedProjectId,
                            'status' => 'active',
                            'assigned_at' => today(),
                            'assigned_by' => Auth::id(),
                        ]);
                    }

                    // 4. Buat record gaji
                    if ($parsedSalary > 0) {
                        EmployeeSalary::create([
                            'employee_id' => $employee->id,
                            'base_salary' => $parsedSalary,
                            'effective_date' => today(),
                            'notes' => 'Gaji awal (Import Excel)',
                            'created_by' => Auth::id(),
                        ]);
                    }
                });

                $successCount++;
            } catch (\Exception $e) {
                $errors[$rowNumber] = "Baris {$rowNumber}: Gagal menyimpan - {$e->getMessage()}";
            }
        }

        return [
            'success' => $successCount,
            'errors' => $errors,
        ];
    }
}
