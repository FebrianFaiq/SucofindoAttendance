<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Profil tambahan khusus karyawan (relasi 1:1 dengan `users`).
     * Ref: BE Framework §4.2 — employees
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('employee_code', 50)
                ->unique()
                ->comment('"ID Karyawan" (FR-EMP-01)');
            $table->string('nik', 16)
                ->unique()
                ->comment('Nomor Induk Kependudukan (KTP) — string supaya angka nol di depan tidak hilang');
            $table->string('phone', 20)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
