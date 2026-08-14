<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tabel master hari libur nasional & internal perusahaan.
     */
    public function up(): void
    {
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique()->comment('Tanggal hari libur');
            $table->string('name')->comment('Nama hari libur (misal: Hari Kemerdekaan RI)');
            $table->boolean('is_national')->default(true)->comment('true = Libur Nasional, false = Libur Khusus Perusahaan');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};
