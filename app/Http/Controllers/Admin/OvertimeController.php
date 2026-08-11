<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Overtime;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OvertimeController extends Controller
{
    /**
     * Tampilkan daftar monitoring lembur.
     * (FR-OVT-02, FR-OVT-03)
     *
     * Menampilkan seluruh entri lembur karyawan dan alert
     * saat melebihi ambang batas yang dikonfigurasi.
     */
    public function index(Request $request): Response
    {
        $query = Overtime::with(['employee.user']);

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter tanggal
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->input('date_to'));
        }

        $overtimes = $query->orderByDesc('date')->paginate(20);

        // Ambil threshold dari settings
        $thresholdHours = Setting::getValue('overtime_threshold_hours', 3);

        return Inertia::render('admin/overtime/index', [
            'overtimes' => $overtimes,
            'thresholdHours' => (float) $thresholdHours,
            'filters' => $request->only(['status', 'date_from', 'date_to']),
        ]);
    }
}
