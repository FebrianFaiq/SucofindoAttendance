<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Data master proyek (FR-PROJ-01).
     * Ref: BE Framework §4.2 — projects
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('code', 50)->unique()->nullable();
            $table->text('description')->nullable();
            $table->date('start_date')->comment('Tanggal mulai kontrak/masa berlaku proyek');
            $table->date('end_date')->comment('Tanggal berakhir — dipakai untuk auto-nonaktifkan proyek (§8.5)');
            $table->boolean('is_active')
                ->default(true)
                ->comment('Bisa diubah manual oleh Admin, atau otomatis oleh scheduled job saat end_date lewat');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
