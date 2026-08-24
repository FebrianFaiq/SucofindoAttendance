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
            'nik' => ['required', 'string', 'max:50', 'unique:employees,nik'],
            'role' => ['required', 'in:employee,intern'],
            'division' => ['nullable', 'required_if:role,intern', 'in:LSI,DukBis,BIT,KSP'],
            'phone' => ['nullable', 'string', 'max:20'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'is_active' => ['nullable', 'boolean'],
            'base_salary' => ['nullable', 'required_if:role,employee', 'numeric', 'min:0'],
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
            'nik.required' => 'NIK wajib diisi.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'project_id.exists' => 'Proyek tidak ditemukan.',
            'base_salary.required_if' => 'Gaji pokok wajib diisi untuk karyawan PTT.',
            'base_salary.numeric' => 'Gaji pokok harus berupa angka.',
            'base_salary.min' => 'Gaji pokok tidak boleh negatif.',
        ];
    }
}
