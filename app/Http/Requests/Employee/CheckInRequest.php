<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

/**
 * Validasi form Check-In karyawan (FR-ATT-01).
 */
class CheckInRequest extends FormRequest
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
            'type' => ['required', 'in:WFO,WFA'],
            'photo' => ['required', 'image', 'max:5120'], // maks 5MB
            'gps_lat' => ['required', 'numeric', 'between:-90,90'],
            'gps_lng' => ['required', 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * Validasi tambahan: cek duplikasi check-in hari ini.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                $employee = $user->employee;

                if (! $employee) {
                    $validator->errors()->add('employee', 'Profil karyawan tidak ditemukan.');

                    return;
                }

                $todayAttendance = $employee->todayAttendance();

                if ($todayAttendance) {
                    $validator->errors()->add('check_in', 'Anda sudah melakukan check-in hari ini.');
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
            'type.required' => 'Tipe kehadiran (WFO/WFA) wajib dipilih.',
            'type.in' => 'Tipe kehadiran harus WFO atau WFA.',
            'photo.required' => 'Foto bukti kehadiran wajib diunggah.',
            'photo.image' => 'File harus berupa gambar.',
            'photo.max' => 'Ukuran foto maksimal 5MB.',
            'gps_lat.required' => 'Koordinat GPS (latitude) diperlukan.',
            'gps_lng.required' => 'Koordinat GPS (longitude) diperlukan.',
        ];
    }
}
