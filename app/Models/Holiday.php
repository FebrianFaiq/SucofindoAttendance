<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Model Master Hari Libur.
 *
 * @property int $id
 * @property Carbon $date
 * @property string $name
 * @property bool $is_national
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Holiday extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'date',
        'name',
        'is_national',
        'description',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_national' => 'boolean',
        ];
    }

    /**
     * Periksa apakah tanggal tertentu merupakan hari libur di database.
     */
    public static function isHoliday(string|Carbon $date): bool
    {
        $dateStr = $date instanceof Carbon ? $date->toDateString() : Carbon::parse($date)->toDateString();

        return static::where('date', $dateStr)->exists();
    }

    /**
     * Dapatkan detail hari libur pada tanggal tertentu (jika ada).
     */
    public static function getHolidayDetails(string|Carbon $date): ?static
    {
        $dateStr = $date instanceof Carbon ? $date->toDateString() : Carbon::parse($date)->toDateString();

        return static::where('date', $dateStr)->first();
    }
}
