<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

/**
 * Validasi form penugasan proyek (FR-EMP-04).
 */
class AssignmentRequest extends FormRequest
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
            'employee_id' => ['required', 'exists:employees,id'],
            'project_id' => ['required', 'exists:projects,id'],
        ];
    }

    /**
     * Custom validation: pastikan employee belum punya proyek aktif.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $employeeId = $this->input('employee_id');

                if (! $employeeId) {
                    return;
                }

                $hasActive = DB::table('employee_projects')
                    ->where('employee_id', $employeeId)
                    ->where('status', 'active')
                    ->exists();

                if ($hasActive) {
                    $validator->errors()->add(
                        'employee_id',
                        'Karyawan ini sudah memiliki proyek aktif. Akhiri penugasan saat ini terlebih dahulu.'
                    );
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Karyawan wajib dipilih.',
            'employee_id.exists' => 'Karyawan tidak ditemukan.',
            'project_id.required' => 'Proyek wajib dipilih.',
            'project_id.exists' => 'Proyek tidak ditemukan.',
        ];
    }
}
