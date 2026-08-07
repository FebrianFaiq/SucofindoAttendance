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
     * Riwayat & status penugasan proyek (FR-EMP-04, FR-EMP-05, FR-PROJ-02).
     * Ref: BE Framework §4.2 — employee_projects
     *
     * Constraint: hanya boleh ada SATU baris `active` per employee_id di satu waktu.
     * Constraint ini dijamin di Service layer (§4.2 — constraint aplikasi utama).
     *
     * Catatan: BE Framework merekomendasikan defense-in-depth via generated column + unique index,
     * namun MySQL 8.4+ melarang FK pada kolom yang direferensi oleh stored generated column.
     * Oleh karena itu, constraint "maks 1 active per employee" ditegakkan sepenuhnya
     * di Service layer (dalam satu transaksi DB), sesuai instruksi utama di §4.2.
     */
    public function up(): void
    {
        Schema::create('employee_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->enum('status', ['active', 'ended'])
                ->comment('Hanya boleh ada satu baris active per employee_id di satu waktu');
            $table->date('assigned_at');
            $table->date('ended_at')
                ->nullable()
                ->comment('Diisi otomatis saat status diubah ke ended');
            $table->foreignId('assigned_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->comment('Admin yang melakukan assignment');
            $table->timestamps();

            // Index komposit untuk resolusi proyek (§8.1)
            $table->index(['employee_id', 'assigned_at', 'ended_at'], 'idx_emp_project_resolution');

            // Index untuk mempercepat lookup status active per employee
            $table->index(['employee_id', 'status'], 'idx_emp_active_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_projects');
    }
};
