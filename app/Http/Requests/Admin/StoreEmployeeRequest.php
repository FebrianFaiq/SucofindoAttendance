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
            'nik' => ['required', 'numeric', 'digits:16', 'unique:employees,nik'],
            'role' => ['required', 'in:employee,intern'],
            'division' => ['nullable', 'required_if:role,intern', 'in:LSI,DukBis,BIT,KSP'],
            'phone' => ['nullable', 'numeric'],
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
            'nik.numeric' => 'NIK harus berupa angka.',
            'nik.digits' => 'NIK harus tepat 16 digit.',
            'phone.numeric' => 'Nomor telepon harus berupa angka.',
            'project_id.exists' => 'Proyek tidak ditemukan.',
            'base_salary.required_if' => 'Gaji pokok wajib diisi untuk karyawan PTT.',
            'base_salary.numeric' => 'Gaji pokok harus berupa angka.',
            'base_salary.min' => 'Gaji pokok tidak boleh negatif.',
        ];
    }
}
