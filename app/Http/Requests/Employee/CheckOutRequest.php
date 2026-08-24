<?php

namespace App\Http\Requests\Employee;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

/**
 * Validasi form Check-Out karyawan (FR-ATT-02).
 */
class CheckOutRequest extends FormRequest
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
            'work_notes' => ['required', 'string', 'min:10'],
            'photo' => ['required', 'image', 'max:2048'], // Maksimal 2MB
            'gps_lat' => ['required', 'numeric', 'between:-90,90'],
            'gps_lng' => ['required', 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * Validasi tambahan: cek bahwa user sudah check-in dan belum check-out.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var User $user */
                $user = Auth::user();
                $employee = $user->employee;

                if (! $employee) {
                    $validator->errors()->add('employee', 'Profil karyawan tidak ditemukan.');

                    return;
                }

                $todayAttendance = $employee->todayAttendance();

                if (! $todayAttendance) {
                    $validator->errors()->add('check_out', 'Anda belum melakukan check-in hari ini.');

                    return;
                }

                if ($todayAttendance->check_out_at !== null) {
                    $validator->errors()->add('check_out', 'Anda sudah melakukan check-out hari ini.');
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
            'work_notes.required' => 'Catatan pekerjaan harian wajib diisi saat check-out.',
            'work_notes.min' => 'Catatan pekerjaan harian minimal 10 karakter.',
        ];
    }
}
