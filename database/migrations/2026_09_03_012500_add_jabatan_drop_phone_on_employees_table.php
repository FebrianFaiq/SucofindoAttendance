<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Menambahkan kolom 'jabatan' (opsional) untuk PTT proyek
 * dan menghapus kolom 'phone' yang sudah tidak digunakan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('jabatan', 100)->nullable()->after('division')
                ->comment('Jabatan/posisi PTT proyek, null untuk magang');
            $table->dropColumn('phone');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('jabatan');
            $table->string('phone', 20)->nullable()->after('division');
        });
    }
};
