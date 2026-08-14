<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Menambahkan kolom 'division' (Bidang) untuk Mahasiswa Magang (LSI, DukBis, BIT, KSP).
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('division', 50)->nullable()->after('nik')->comment('Bidang untuk Mahasiswa Magang: LSI, DukBis, BIT, KSP');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('division');
        });
    }
};
