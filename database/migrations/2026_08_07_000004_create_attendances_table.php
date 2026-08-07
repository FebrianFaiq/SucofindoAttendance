<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
     * TIDAK ada kolom date — filter tanggal mengandalkan check_in_at + functional index.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->enum('type', ['WFO', 'WFA'])
                ->comment('Ditentukan sekali saat check-in, berlaku untuk seluruh record hari itu');
            $table->dateTime('check_in_at')->nullable();
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
        });

        // Functional unique index — MySQL 8.0.13+
        // Proteksi 1 record/hari per karyawan di level database
        // Juga dipakai untuk filter tanggal (sargable query)
        DB::statement('
            ALTER TABLE attendances
            ADD UNIQUE INDEX uniq_employee_checkin_date (employee_id, (DATE(check_in_at)))
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
