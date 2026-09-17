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
        Schema::table('projects', function (Blueprint $table) {
            $table->decimal('site_latitude', 10, 7)->nullable()->after('description')->comment('Latitude lokasi site proyek');
            $table->decimal('site_longitude', 10, 7)->nullable()->after('site_latitude')->comment('Longitude lokasi site proyek');
            $table->unsignedInteger('site_radius')->default(200)->after('site_longitude')->comment('Radius WFO dalam meter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['site_latitude', 'site_longitude', 'site_radius']);
        });
    }
};
