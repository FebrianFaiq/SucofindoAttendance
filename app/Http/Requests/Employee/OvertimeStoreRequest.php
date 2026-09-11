<?php

namespace App\Http\Requests\Employee;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi form input lembur (FR-OVT-01).
 */
class OvertimeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        return $user !== null && $user->canOvertime();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'description' => ['required', 'string', 'min:10'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'date.required' => 'Tanggal lembur wajib diisi.',
            'start_time.required' => 'Jam mulai lembur wajib diisi.',
            'start_time.date_format' => 'Format jam mulai harus HH:MM.',
            'end_time.required' => 'Jam selesai lembur wajib diisi.',
            'end_time.after' => 'Jam selesai harus setelah jam mulai.',
            'description.required' => 'Keterangan lembur wajib diisi.',
            'description.min' => 'Keterangan lembur minimal 10 karakter.',
        ];
    }
}
