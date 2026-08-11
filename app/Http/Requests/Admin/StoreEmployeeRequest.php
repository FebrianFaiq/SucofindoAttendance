<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi form tambah karyawan (FR-EMP-01).
 */
class StoreEmployeeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'employee_code' => ['required', 'string', 'max:50', 'unique:employees,employee_code'],
            'nik' => ['required', 'string', 'max:50', 'unique:employees,nik'],
            'phone' => ['nullable', 'string', 'max:20'],
            'project_id' => ['nullable', 'exists:projects,id'],
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
            'project_id.exists' => 'Proyek tidak ditemukan.',
        ];
    }
}
