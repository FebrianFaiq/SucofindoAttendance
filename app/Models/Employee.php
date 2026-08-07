<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Profil tambahan khusus karyawan (relasi 1:1 dengan users).
 * Ref: BE Framework §4.2 — employees
 *
 * @property int $id
 * @property int $user_id
 * @property string $employee_code
 * @property string $nik
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
        'employee_code',
        'nik',
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
}
