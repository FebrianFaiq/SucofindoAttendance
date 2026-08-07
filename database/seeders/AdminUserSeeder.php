<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * 1 akun admin awal untuk keperluan testing/UAT.
     * Ref: BE Framework §4.4
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin SUCOFINDO',
            'email' => 'admin@sucofindo.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'must_change_password' => true,
            'is_active' => true,
        ]);
    }
}
