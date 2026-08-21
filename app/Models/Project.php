<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Data master proyek (FR-PROJ-01).
 * Ref: BE Framework §4.2 — projects
 *
 * @property int $id
 * @property string $name
 * @property string|null $code
 * @property string|null $description
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Project extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'start_date',
        'end_date',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * Karyawan yang ditugaskan ke proyek ini.
     *
     * @return BelongsToMany<Employee, $this>
     */
    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_projects')
            ->withPivot('status', 'assigned_at', 'ended_at', 'assigned_by')
            ->withTimestamps();
    }

    // ───────────────────────────────────────────
    // Scopes
    // ───────────────────────────────────────────

    /**
     * Scope: hanya proyek aktif.
     *
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
