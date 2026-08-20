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
            'employee_ids' => ['required', 'array', 'min:1'],
            'employee_ids.*' => ['exists:employees,id'],
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
                $employeeIds = $this->input('employee_ids', []);

                if (empty($employeeIds)) {
                    return;
                }

                $activeEmployees = DB::table('employee_projects')
                    ->whereIn('employee_id', $employeeIds)
                    ->where('status', 'active')
                    ->pluck('employee_id')
                    ->toArray();

                if (count($activeEmployees) > 0) {
                    $validator->errors()->add(
                        'employee_ids',
                        'Satu atau lebih karyawan yang dipilih sudah memiliki proyek aktif.'
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
