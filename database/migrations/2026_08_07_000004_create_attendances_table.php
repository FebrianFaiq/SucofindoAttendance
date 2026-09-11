<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Data check-in/check-out harian (FR-ATT-01, FR-ATT-02).
     * Ref: BE Framework §4.2 — attendances
     *
     * TIDAK ada kolom project_id — proyek ditelusuri lewat employee_projects (§8.1).
     * Filter tanggal memakai kolom generated check_in_date (sargable di MySQL & MariaDB).
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->enum('type', ['WFO', 'WFA'])
                ->comment('Ditentukan sekali saat check-in, berlaku untuk seluruh record hari itu');
            $table->dateTime('check_in_at')->nullable();
            $table->date('check_in_date')
                ->nullable()
                ->storedAs('DATE(check_in_at)')
                ->comment('Generated column: dasar unique 1x/hari per karyawan & filter tanggal sargable');
            $table->string('check_in_evidence', 255)
                ->nullable()
                ->comment('Path foto bukti check-in');
            $table->decimal('check_in_latitude', 10, 7)
                ->nullable()
                ->comment('Koordinat GPS saat check-in');
            $table->decimal('check_in_longitude', 10, 7)
                ->nullable()
                ->comment('Koordinat GPS saat check-in');
            $table->dateTime('check_out_at')->nullable();
            $table->text('work_notes')
                ->nullable()
                ->comment('Wajib diisi saat check-out (FR-ATT-02), divalidasi di Form Request');
            $table->timestamps();

            // Proteksi 1 record/hari per karyawan di level database,
            // lewat generated column (bukan functional key parts — syntax
            // INDEX ((expr)) hanya MySQL 8.0.13+, tidak didukung MariaDB).
            $table->unique(['employee_id', 'check_in_date'], 'uniq_employee_checkin_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
