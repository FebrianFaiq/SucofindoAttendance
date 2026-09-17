<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    /**
     * Dummy data proyek untuk development.
     * Ref: BE Framework §4.4 — ProjectSeeder (opsional)
     */
    public function run(): void
    {
        $now = now();

        $projects = [
            [
                'name' => 'Proyek Inspeksi Kalimantan',
                'code' => 'PIK-2026',
                'description' => 'Proyek inspeksi fasilitas industri di wilayah Kalimantan Timur',
                'start_date' => '2026-07-01',
                'end_date' => '2026-12-31',
                'is_active' => true,
                'site_latitude' => -1.265386, // Balikpapan roughly
                'site_longitude' => 116.831200,
                'site_radius' => 500,
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Sertifikasi ISO Pabrik Surabaya',
                'code' => 'SIPS-2026',
                'description' => 'Audit dan sertifikasi ISO 9001:2015 untuk pabrik manufaktur di Surabaya',
                'start_date' => '2026-08-01',
                'end_date' => '2027-01-31',
                'is_active' => true,
                'site_latitude' => -7.254776, // Surabaya (Default Sucofindo)
                'site_longitude' => 112.717212,
                'site_radius' => 200,
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Pengujian Laboratorium Jakarta',
                'code' => 'PLJ-2026',
                'description' => 'Pengujian sampel material konstruksi untuk proyek infrastruktur Jakarta',
                'start_date' => '2026-06-15',
                'end_date' => '2026-09-30',
                'is_active' => true,
                'site_latitude' => -6.208763, // Jakarta roughly
                'site_longitude' => 106.845599,
                'site_radius' => 300,
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ];

        foreach ($projects as $project) {
            DB::table('projects')->updateOrInsert(
                ['code' => $project['code']],
                $project
            );
        }
    }
}
