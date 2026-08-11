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
        $admin = User::updateOrCreate(
            ['email' => 'admin@sucofindo.com'],
            [
                'name' => 'Admin SUCOFINDO',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        // Ambil ID proyek jika ada
        $project1 = Project::where('code', 'PIK-2026')->first();
        $project2 = Project::where('code', 'SIPS-2026')->first();
        $project3 = Project::where('code', 'PLJ-2026')->first();

        // 2. Akun Karyawan Utama (Testing Login)
        $employeeUser1 = User::updateOrCreate(
            ['email' => 'karyawan@sucofindo.com'],
            [
                'name' => 'Budi Santoso (Karyawan PTT)',
                'password' => Hash::make('123'),
                'role' => 'employee',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        $emp1 = Employee::updateOrCreate(
            ['user_id' => $employeeUser1->id],
            [
                'employee_code' => 'EMP-0001',
                'nik' => '3201123456780001',
                'phone' => '081234567890',
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
                'code' => 'EMP-0002',
                'nik' => '3201123456780002',
                'phone' => '081298765432',
                'project_id' => $project2?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@sucofindo.com',
                'code' => 'EMP-0003',
                'nik' => '3201123456780003',
                'phone' => '081311223344',
                'project_id' => $project3?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi.lestari@sucofindo.com',
                'code' => 'EMP-0004',
                'nik' => '3201123456780004',
                'phone' => '081255667788',
                'project_id' => $project1?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky.pratama@sucofindo.com',
                'code' => 'EMP-0005',
                'nik' => '3201123456780005',
                'phone' => '081299887766',
                'project_id' => null,
                'is_active' => false,
            ],
        ];

        foreach ($dummyEmployees as $dummy) {
            $user = User::updateOrCreate(
                ['email' => $dummy['email']],
                [
                    'name' => $dummy['name'],
                    'password' => Hash::make('123'),
                    'role' => 'employee',
                    'must_change_password' => false,
                    'is_active' => $dummy['is_active'],
                ]
            );

            $emp = Employee::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'employee_code' => $dummy['code'],
                    'nik' => $dummy['nik'],
                    'phone' => $dummy['phone'],
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
