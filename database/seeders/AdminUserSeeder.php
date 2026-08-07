<?php

namespace Database\Seeders;

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
        User::updateOrCreate(
            ['email' => 'admin@sucofindo.com'],
            [
                'name' => 'Admin SUCOFINDO',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        // 2. Akun Karyawan (Employee)
        User::updateOrCreate(
            ['email' => 'karyawan@sucofindo.com'],
            [
                'name' => 'Budi Santoso (Karyawan PTT)',
                'password' => Hash::make('karyawan123'),
                'role' => 'employee',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );
    }
}
