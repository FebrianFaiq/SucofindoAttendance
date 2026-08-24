<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Profil tambahan khusus karyawan (relasi 1:1 dengan users).
 * Ref: BE Framework §4.2 — employees
 *
 * @property int $id
 * @property int $user_id
 * @property string $nik
 * @property string|null $division
 * @property string|null $phone
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $user
 */
class Employee extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'nik',
        'division',
        'phone',
    ];

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * User yang memiliki profil karyawan ini.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Semua record kehadiran karyawan ini.
     *
     * @return HasMany<Attendance, $this>
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Semua entri lembur karyawan ini.
     *
     * @return HasMany<Overtime, $this>
     */
    public function overtimes(): HasMany
    {
        return $this->hasMany(Overtime::class);
    }

    /**
     * Riwayat gaji karyawan ini.
     *
     * @return HasMany<EmployeeSalary, $this>
     */
    public function salaries(): HasMany
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    /**
     * Proyek-proyek yang ditugaskan ke karyawan ini.
     *
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'employee_projects')
            ->withPivot('status', 'assigned_at', 'ended_at', 'assigned_by')
            ->withTimestamps();
    }

    // ───────────────────────────────────────────
    // Helpers
    // ───────────────────────────────────────────

    /**
     * Dapatkan proyek aktif saat ini (maks 1 per karyawan).
     * Mengembalikan null jika tidak ada proyek aktif.
     */
    public function activeProject(): ?Project
    {
        return $this->projects()
            ->wherePivot('status', 'active')
            ->first();
    }

    /**
     * Dapatkan record kehadiran hari ini (jika ada).
     */
    public function todayAttendance(): ?Attendance
    {
        return $this->attendances()->today()->first();
    }

    /**
     * Dapatkan gaji aktif saat ini (jika ada).
     */
    public function activeSalary(): ?EmployeeSalary
    {
        return $this->salaries()->active()->latest('effective_date')->first();
    }
}
