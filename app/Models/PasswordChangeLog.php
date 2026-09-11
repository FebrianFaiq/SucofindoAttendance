<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Audit ringan untuk perubahan password (FR-AUTH-04).
 * Ref: BE Framework §4.2 — password_change_logs
 *
 * @property int $id
 * @property int $user_id
 * @property int $changed_by
 * @property string $method
 * @property Carbon|null $created_at
 * @property-read User $user
 * @property-read User $changer
 */
class PasswordChangeLog extends Model
{
    /**
     * Tabel ini hanya memiliki created_at, tanpa updated_at.
     */
    public $timestamps = false;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'changed_by',
        'method',
        'created_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * Pemilik password yang diubah.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Admin/pelaku yang melakukan perubahan password.
     *
     * @return BelongsTo<User, $this>
     */
    public function changer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
