<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Seed default settings.
     * Ref: BE Framework §4.2 — settings (Seed default)
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'overtime_threshold_hours',
                'value' => '3',
                'updated_by' => null,
                'updated_at' => now(),
            ],
            [
                'key' => 'overtime_threshold_period',
                'value' => 'daily',
                'updated_by' => null,
                'updated_at' => now(),
            ],
        ];

        DB::table('settings')->insert($settings);
    }
}
