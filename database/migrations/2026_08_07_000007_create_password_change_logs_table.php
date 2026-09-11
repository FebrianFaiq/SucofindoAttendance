<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Audit ringan untuk FR-AUTH-04 (rekomendasi PRD, bukan Audit Log formal).
     * Ref: BE Framework §4.2 — password_change_logs
     */
    public function up(): void
    {
        Schema::create('password_change_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Pemilik password yang diubah');
            $table->foreignId('changed_by')
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Admin/pelaku perubahan (bisa sama dengan user_id jika self-change)');
            $table->enum('method', ['reset', 'manual_set', 'self_change']);
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_change_logs');
    }
};
