<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HolidaySeeder extends Seeder
{
    /**
     * Seed master hari libur nasional.
     * Menggunakan data resmi SKB 3 Menteri dengan opsi auto-sync API jika tersedia.
     */
    public function run(): void
    {
        $year = 2026;

        // Data Hari Libur Nasional & Cuti Bersama 2026 (SKB 3 Menteri)
        $defaultHolidays = [
            ['date' => "{$year}-01-01", 'name' => 'Tahun Baru 2026 Masehi', 'is_national' => true],
            ['date' => "{$year}-01-16", 'name' => 'Isra Mikraj Nabi Muhammad SAW', 'is_national' => true],
            ['date' => "{$year}-02-17", 'name' => 'Tahun Baru Imlek 2577 Kongzili', 'is_national' => true],
            ['date' => "{$year}-03-20", 'name' => 'Hari Suci Nyepi (Tahun Baru Saka 1948)', 'is_national' => true],
            ['date' => "{$year}-03-21", 'name' => 'Hari Raya Idul Fitri 1447 Hijriah (Hari Pertama)', 'is_national' => true],
            ['date' => "{$year}-03-22", 'name' => 'Hari Raya Idul Fitri 1447 Hijriah (Hari Kedua)', 'is_national' => true],
            ['date' => "{$year}-03-23", 'name' => 'Cuti Bersama Hari Raya Idul Fitri', 'is_national' => true],
            ['date' => "{$year}-03-24", 'name' => 'Cuti Bersama Hari Raya Idul Fitri', 'is_national' => true],
            ['date' => "{$year}-04-03", 'name' => 'Wafat Yesus Kristus', 'is_national' => true],
            ['date' => "{$year}-04-05", 'name' => 'Hari Paskah', 'is_national' => true],
            ['date' => "{$year}-05-01", 'name' => 'Hari Buruh Internasional', 'is_national' => true],
            ['date' => "{$year}-05-14", 'name' => 'Kenaikan Yesus Kristus', 'is_national' => true],
            ['date' => "{$year}-05-28", 'name' => 'Hari Raya Idul Adha 1447 Hijriah', 'is_national' => true],
            ['date' => "{$year}-05-31", 'name' => 'Hari Raya Waisak 2570 BE', 'is_national' => true],
            ['date' => "{$year}-06-01", 'name' => 'Hari Lahir Pancasila', 'is_national' => true],
            ['date' => "{$year}-06-17", 'name' => 'Tahun Baru Islam 1448 Hijriah', 'is_national' => true],
            ['date' => "{$year}-08-17", 'name' => 'Hari Kemerdekaan Republik Indonesia', 'is_national' => true],
            ['date' => "{$year}-08-26", 'name' => 'Maulid Nabi Muhammad SAW', 'is_national' => true],
            ['date' => "{$year}-12-25", 'name' => 'Hari Raya Natal', 'is_national' => true],
            ['date' => "{$year}-12-26", 'name' => 'Cuti Bersama Hari Raya Natal', 'is_national' => true],
        ];

        // Coba sync via API jika ada koneksi
        try {
            $response = Http::timeout(3)->get("https://api-harilibur.vercel.app/api?year={$year}");
            if ($response->successful() && is_array($response->json())) {
                $apiHolidays = $response->json();
                foreach ($apiHolidays as $item) {
                    if (! empty($item['holiday_date']) && ! empty($item['holiday_name']) && ! empty($item['is_national_holiday'])) {
                        Holiday::updateOrCreate(
                            ['date' => $item['holiday_date']],
                            [
                                'name' => $item['holiday_name'],
                                'is_national' => (bool) $item['is_national_holiday'],
                                'description' => 'Disinkronkan otomatis dari API Hari Libur Nasional',
                            ]
                        );
                    }
                }

                return;
            }
        } catch (\Throwable $e) {
            Log::info("HolidaySeeder: Menggunakan data fallback SKB 3 Menteri ({$e->getMessage()})");
        }

        // Fallback default
        foreach ($defaultHolidays as $holiday) {
            Holiday::updateOrCreate(
                ['date' => $holiday['date']],
                [
                    'name' => $holiday['name'],
                    'is_national' => $holiday['is_national'],
                    'description' => 'Hari Libur Nasional Resmi (SKB 3 Menteri)',
                ]
            );
        }
    }
}
