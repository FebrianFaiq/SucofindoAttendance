<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Entri lembur manual (FR-OVT-01).
     * Ref: BE Framework §4.2 — overtimes
     *
     * Duration dihitung dari pengurangan end_time dan start_time — tidak disimpan sebagai kolom.
     * TIDAK ada project_id — proyek ditelusuri dari employee_projects berdasarkan kolom date (§8.1).
     */
    public function up(): void
    {
        Schema::create('overtimes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->date('date')
                ->comment('Tetap kolom biasa — tidak ada datetime yang bisa jadi sumbernya');
            $table->time('start_time');
            $table->time('end_time');
            $table->text('description');
            $table->enum('status', ['pending', 'approved', 'rejected'])
                ->default('pending')
                ->comment('Menentukan apakah entri masih bisa diedit karyawan (§8.6)');
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->comment('Admin yang approve/reject');
            $table->timestamp('approved_at')
                ->nullable()
                ->comment('Diisi saat status berubah dari pending');
            $table->text('rejection_reason')
                ->nullable()
                ->comment('Wajib diisi Admin kalau status = rejected');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtimes');
    }
};
