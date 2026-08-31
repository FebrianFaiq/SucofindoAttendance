<?php

namespace App\Http\Requests\Employee;

use App\Models\Holiday;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

/**
 * Validasi form Check-In karyawan & magang (FR-ATT-01).
 * Meliputi validasi weekend & hari libur nasional/perusahaan.
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
     * Validasi tambahan:
     * 1. Cek hari libur (Weekend & Tanggal Merah)
     * 2. Cek duplikasi check-in hari ini
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $today = today();

                // Hari libur dan akhir pekan sekarang diizinkan untuk absen

                /** @var User $user */
                $user = Auth::user();
                $employee = $user->employee;

                if (! $employee) {
                    $validator->errors()->add('employee', 'Profil karyawan tidak ditemukan.');

                    return;
                }

                // 3. Cek apakah sudah check-in hari ini
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
