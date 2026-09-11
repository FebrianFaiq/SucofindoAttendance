<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Entri lembur manual (FR-OVT-01).
 * Ref: BE Framework §4.2 — overtimes
 *
 * Duration dihitung dari end_time - start_time, tidak disimpan sebagai kolom.
 *
 * @property int $id
 * @property int $employee_id
 * @property Carbon $date
 * @property string $start_time
 * @property string $end_time
 * @property string $description
 * @property string $status
 * @property int|null $approved_by
 * @property Carbon|null $approved_at
 * @property string|null $rejection_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Employee $employee
 * @property-read User|null $approver
 * @property-read float $duration
 */
class Overtime extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'spkl_number',
        'date',
        'start_time',
        'end_time',
        'description',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * Karyawan pemilik entri lembur ini.
     *
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Admin yang approve/reject lembur ini.
     *
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ───────────────────────────────────────────
    // Accessors
    // ───────────────────────────────────────────

    /**
     * Hitung durasi lembur (dalam jam, desimal).
     * Contoh: 1.5 = 1 jam 30 menit.
     */
    public function getDurationAttribute(): float
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);

        if ($end->lessThan($start)) {
            $end->addDay();
        }

        return round($start->floatDiffInHours($end), 2);
    }

    // ───────────────────────────────────────────
    // Scopes
    // ───────────────────────────────────────────

    /**
     * Scope: hanya entri berstatus pending.
     *
     * @param  Builder<Overtime>  $query
     * @return Builder<Overtime>
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: filter berdasarkan employee.
     *
     * @param  Builder<Overtime>  $query
     * @return Builder<Overtime>
     */
    public function scopeForEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }
}
