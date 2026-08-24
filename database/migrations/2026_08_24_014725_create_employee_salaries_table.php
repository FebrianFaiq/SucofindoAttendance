<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel riwayat gaji karyawan PTT.
 * Setiap record mewakili satu periode gaji yang berlaku.
 * Gaji aktif = record dengan ended_at IS NULL.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->decimal('base_salary', 15, 2); // Gaji pokok bulanan
            $table->date('effective_date');          // Tanggal mulai berlaku
            $table->date('ended_at')->nullable();    // Null = masih berlaku
            $table->string('notes')->nullable();     // Keterangan (opsional)
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Index untuk query gaji aktif
            $table->index(['employee_id', 'ended_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salaries');
    }
};
