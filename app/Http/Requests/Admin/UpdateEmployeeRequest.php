<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validasi form update karyawan (FR-EMP-02).
 */
class UpdateEmployeeRequest extends FormRequest
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
        $employee = $this->route('employee');
        $userId = $employee?->user_id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'employee_code' => ['required', 'string', 'max:50', Rule::unique('employees', 'employee_code')->ignore($employee?->id)],
            'nik' => ['required', 'string', 'max:50', Rule::unique('employees', 'nik')->ignore($employee?->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama karyawan wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah terdaftar.',
            'employee_code.required' => 'Kode karyawan wajib diisi.',
            'employee_code.unique' => 'Kode karyawan sudah digunakan.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.unique' => 'NIK sudah terdaftar.',
        ];
    }
}
