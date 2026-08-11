<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Riwayat & status penugasan proyek (FR-EMP-04, FR-EMP-05, FR-PROJ-02).
 * Ref: BE Framework §4.2 — employee_projects
 *
 * Constraint: hanya boleh ada SATU baris `active` per employee_id di satu waktu.
 * Constraint ini dijamin di Service layer.
 *
 * @property int $id
 * @property int $employee_id
 * @property int $project_id
 * @property string $status
 * @property Carbon $assigned_at
 * @property Carbon|null $ended_at
 * @property int|null $assigned_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Employee $employee
 * @property-read Project $project
 * @property-read User|null $assigner
 */
class EmployeeProject extends Model
{
    /**
     * @var string
     */
    protected $table = 'employee_projects';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'project_id',
        'status',
        'assigned_at',
        'ended_at',
        'assigned_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'assigned_at' => 'date',
            'ended_at' => 'date',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Admin yang melakukan assignment.
     *
     * @return BelongsTo<User, $this>
     */
    public function assigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    // ───────────────────────────────────────────
    // Scopes
    // ───────────────────────────────────────────

    /**
     * Scope: hanya assignment yang aktif.
     *
     * @param \Illuminate\Database\Eloquent\Builder<EmployeeProject> $query
     * @return \Illuminate\Database\Eloquent\Builder<EmployeeProject>
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
