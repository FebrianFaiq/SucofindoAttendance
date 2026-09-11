<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Ref: BE Framework §4.4
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingsSeeder::class,
            ProjectSeeder::class,
            HolidaySeeder::class,
        ]);
    }
}
