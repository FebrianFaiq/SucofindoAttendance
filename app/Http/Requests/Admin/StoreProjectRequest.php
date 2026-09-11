<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi form tambah/edit proyek (FR-PROJ-01).
 */
class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'code' => ['nullable', 'string', 'max:50', 'unique:projects,code'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama proyek wajib diisi.',
            'code.unique' => 'Kode proyek sudah digunakan.',
            'start_date.required' => 'Tanggal mulai proyek wajib diisi.',
            'end_date.required' => 'Tanggal berakhir proyek wajib diisi.',
            'end_date.after' => 'Tanggal berakhir harus setelah tanggal mulai.',
        ];
    }
}
