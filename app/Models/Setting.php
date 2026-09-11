<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Konfigurasi sistem (key-value store).
 * Ref: BE Framework §4.2 — settings
 *
 * @property int $id
 * @property string $key
 * @property string $value
 * @property int|null $updated_by
 * @property Carbon|null $updated_at
 * @property-read User|null $updater
 */
class Setting extends Model
{
    /**
     * Tabel settings tidak memiliki kolom created_at.
     */
    public $timestamps = false;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'value',
        'updated_by',
        'updated_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'updated_at' => 'datetime',
        ];
    }

    // ───────────────────────────────────────────
    // Relationships
    // ───────────────────────────────────────────

    /**
     * Admin yang terakhir mengubah setting ini.
     *
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // ───────────────────────────────────────────
    // Helpers
    // ───────────────────────────────────────────

    /**
     * Ambil nilai setting berdasarkan key.
     * Mengembalikan default jika key tidak ditemukan.
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();

        return $setting ? $setting->value : $default;
    }
}
