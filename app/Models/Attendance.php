<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Data check-in/check-out harian (FR-ATT-01, FR-ATT-02).
 * Ref: BE Framework §4.2 — attendances
 *
 * @property int $id
 * @property int $employee_id
 * @property string $type
 * @property Carbon|null $check_in_at
 * @property string|null $check_in_evidence
 * @property float|null $check_in_latitude
 * @property float|null $check_in_longitude
 * @property Carbon|null $check_out_at
 * @property string|null $work_notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Employee $employee
 */
class Attendance extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'type',
        'check_in_at',
        'check_in_evidence',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_at',
        'check_out_evidence',
        'check_out_latitude',
        'check_out_longitude',
        'work_notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'check_in_at' => 'datetime',
            'check_out_at' => 'datetime',
            'check_in_latitude' => 'decimal:7',
            'check_in_longitude' => 'decimal:7',
            'check_out_latitude' => 'decimal:7',
            'check_out_longitude' => 'decimal:7',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * Karyawan pemilik record kehadiran ini.
     *
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    // ───────────────────────────────────────────
    // Scopes
    // ───────────────────────────────────────────

    /**
     * Scope: hanya record hari ini.
     *
     * @param  Builder<Attendance>  $query
     * @return Builder<Attendance>
     */
    public function scopeToday($query)
    {
        return $query->whereDate('check_in_at', today());
    }

    /**
     * Scope: filter berdasarkan employee.
     *
     * @param  Builder<Attendance>  $query
     * @return Builder<Attendance>
     */
    public function scopeForEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }
}
