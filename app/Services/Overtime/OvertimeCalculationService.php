<?php

namespace App\Services\Overtime;

use App\Models\Holiday;
use App\Models\Setting;
use Carbon\Carbon;

class OvertimeCalculationService
{
    /**
     * Hitung durasi jam lembur berdasarkan jam masuk dan keluar.
     * Mendukung lembur yang melewati tengah malam.
     */
    public function calculateDuration(string $startTime, string $endTime): float
    {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        if ($end->lessThan($start)) {
            // Berarti lembur sampai hari berikutnya (lewat tengah malam)
            $end->addDay();
        }

        $diffInMinutes = $start->diffInMinutes($end);

        // Kembalikan dalam format float (jam)
        return abs($diffInMinutes) / 60;
    }

    /**
     * Cek apakah tanggal merupakan hari libur.
     * Kondisi: Sabtu/Minggu atau terdaftar di kalender libur.
     */
    public function isHoliday(string $date): bool
    {
        $carbonDate = Carbon::parse($date);

        if ($carbonDate->isWeekend()) {
            return true;
        }

        $isNationalHoliday = Holiday::where('date', $date)->exists();

        return $isNationalHoliday;
    }

    /**
     * Dapatkan rate persentase berdasarkan jenis hari.
     */
    public function getRate(bool $isHoliday): float
    {
        if ($isHoliday) {
            $holidayRate = Setting::where('key', 'overtime_rate_holiday')->value('value');

            return (float) ($holidayRate ?? 0.02); // default 2%
        }

        $normalRate = Setting::where('key', 'overtime_rate_normal')->value('value');

        return (float) ($normalRate ?? 0.015); // default 1.5%
    }

    /**
     * Hitung upah lembur dalam nominal Rupiah.
     */
    public function calculatePay(float $baseSalary, float $rate, float $duration): float
    {
        return $baseSalary * $rate * $duration;
    }
}
