<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeeProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed akun admin dan karyawan awal untuk keperluan testing/UAT.
     */
    public function run(): void
    {
        // 1. Akun Admin
        $admin = User::withTrashed()->updateOrCreate(
            ['email' => 'admin@sucofindo.com'],
            [
                'name' => 'Admin SUCOFINDO',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'must_change_password' => false,
                'is_active' => true,
                'deleted_at' => null,
            ]
        );

        // Ambil ID proyek jika ada
        $project1 = Project::where('code', 'PIK-2026')->first();
        $project2 = Project::where('code', 'SIPS-2026')->first();
        $project3 = Project::where('code', 'PLJ-2026')->first();

        // 2. Akun Karyawan Utama (Testing Login)
        $employeeUser1 = User::withTrashed()->updateOrCreate(
            ['email' => 'karyawan@sucofindo.com'],
            [
                'name' => 'Budi Santoso (Karyawan PTT)',
                'password' => Hash::make('123'),
                'role' => 'employee',
                'must_change_password' => false,
                'is_active' => true,
                'deleted_at' => null,
            ]
        );

        $emp1 = Employee::withTrashed()->updateOrCreate(
            ['user_id' => $employeeUser1->id],
            [
                'nik' => '3201123456780001',
                'phone' => '081234567890',
                'deleted_at' => null,
            ]
        );

        if ($project1) {
            EmployeeProject::updateOrCreate(
                ['employee_id' => $emp1->id, 'project_id' => $project1->id],
                ['status' => 'active', 'assigned_at' => today(), 'assigned_by' => $admin->id]
            );
        }

        // 3. Tambahan Karyawan Dummy
        $dummyEmployees = [
            [
                'name' => 'Siti Rahmawati',
                'email' => 'siti.rahma@sucofindo.com',
                'nik' => '3201123456780002',
                'phone' => '081298765432',
                'project_id' => $project2?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@sucofindo.com',
                'nik' => '3201123456780003',
                'phone' => '081311223344',
                'project_id' => $project3?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi.lestari@sucofindo.com',
                'nik' => '3201123456780004',
                'phone' => '081255667788',
                'project_id' => $project1?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky.pratama@sucofindo.com',
                'nik' => '3201123456780005',
                'phone' => '081299887766',
                'role' => 'employee',
                'project_id' => null,
                'is_active' => false,
            ],
            [
                'name' => 'Kevin Sanjaya (Mahasiswa Magang)',
                'email' => 'magang@sucofindo.com',
                'nik' => '3201123456780006',
                'phone' => '081233445566',
                'role' => 'intern',
                'division' => 'BIT',
                'project_id' => null,
                'is_active' => true,
            ],
        ];

        foreach ($dummyEmployees as $dummy) {
            $user = User::withTrashed()->updateOrCreate(
                ['email' => $dummy['email']],
                [
                    'name' => $dummy['name'],
                    'password' => Hash::make('123'),
                    'role' => $dummy['role'] ?? 'employee',
                    'must_change_password' => false,
                    'is_active' => $dummy['is_active'],
                    'deleted_at' => null,
                ]
            );

            $emp = Employee::withTrashed()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nik' => $dummy['nik'],
                    'division' => $dummy['division'] ?? null,
                    'phone' => $dummy['phone'],
                    'deleted_at' => null,
                ]
            );

            if ($dummy['project_id']) {
                EmployeeProject::updateOrCreate(
                    ['employee_id' => $emp->id, 'project_id' => $dummy['project_id']],
                    ['status' => 'active', 'assigned_at' => today(), 'assigned_by' => $admin->id]
                );
            }
        }
    }
}
