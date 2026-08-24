<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Riwayat gaji karyawan PTT.
 *
 * @property int $id
 * @property int $employee_id
 * @property float $base_salary
 * @property Carbon $effective_date
 * @property Carbon|null $ended_at
 * @property string|null $notes
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Employee $employee
 * @property-read User|null $creator
 */
class EmployeeSalary extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'base_salary',
        'effective_date',
        'ended_at',
        'notes',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:2',
            'effective_date' => 'date',
            'ended_at' => 'date',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * Karyawan pemilik record gaji ini.
     *
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Admin yang menginput/mengubah gaji.
     *
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ───────────────────────────────────────────
    // Scopes
    // ───────────────────────────────────────────

    /**
     * Scope: hanya gaji yang masih aktif (ended_at IS NULL).
     */
    public function scopeActive($query)
    {
        return $query->whereNull('ended_at');
    }

    /**
     * Scope: gaji yang berlaku pada tanggal tertentu.
     */
    public function scopeEffectiveOn($query, $date)
    {
        return $query->where('effective_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('ended_at')
                    ->orWhere('ended_at', '>', $date);
            });
    }
}
