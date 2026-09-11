<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('check_out_evidence')->nullable()->after('check_out_at');
            $table->decimal('check_out_latitude', 10, 7)->nullable()->after('check_out_evidence');
            $table->decimal('check_out_longitude', 10, 7)->nullable()->after('check_out_latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'check_out_evidence',
                'check_out_latitude',
                'check_out_longitude',
            ]);
        });
    }
};
