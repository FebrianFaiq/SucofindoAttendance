<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Menambahkan role 'intern' (Mahasiswa Magang) pada tabel users.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employee', 'intern') NOT NULL DEFAULT 'employee' COMMENT 'Menentukan akses menu & policy'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee' COMMENT 'Menentukan akses menu & policy'");
    }
};
