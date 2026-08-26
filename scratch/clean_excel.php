<?php
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$templatePath = __DIR__ . '/../storage/app/templates/Format_Rekap_Lembur_HRD_Usulan.xlsx';

echo "Loading template: $templatePath\n";
$spreadsheet = IOFactory::load($templatePath);

$sheets = [
    'Master Karyawan' => ['A', 'B', 'C', 'D', 'E'],
    'Kalender Libur' => ['A', 'B'],
    'Data Lembur (Detail)' => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
    'Rekap Pendanaan' => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
];

foreach ($sheets as $sheetName => $cols) {
    $sheet = $spreadsheet->getSheetByName($sheetName);
    if ($sheet) {
        for ($row = 5; $row <= 100; $row++) {
            foreach ($cols as $col) {
                $sheet->setCellValue($col . $row, null);
            }
        }
        echo "Cleared sheet: $sheetName\n";
    }
}

$writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
$writer->save($templatePath);
echo "Template saved successfully.\n";
