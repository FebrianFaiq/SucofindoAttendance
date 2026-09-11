<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    /**
     * Tampilkan halaman daftar hari libur.
     */
    public function index(Request $request): Response
    {
        // Ambil filter tahun (default tahun ini)
        $year = $request->query('year', now()->year);

        $holidays = Holiday::whereYear('date', $year)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($holiday) {
                return [
                    'id' => $holiday->id,
                    'date' => $holiday->date->format('Y-m-d'),
                    'date_formatted' => $holiday->date->translatedFormat('d F Y'),
                    'name' => $holiday->name,
                    'is_national' => $holiday->is_national,
                    'description' => $holiday->description,
                ];
            });

        // Generate list of available years for filter (e.g. 5 years ago to 5 years future)
        $currentYear = now()->year;
        $availableYears = collect(range($currentYear - 5, $currentYear + 5))->sort()->values();

        return Inertia::render('admin/holidays/index', [
            'holidays' => $holidays,
            'selectedYear' => (int) $year,
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * Simpan hari libur baru (nasional atau khusus perusahaan).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'unique:holidays,date'],
            'name' => ['required', 'string', 'max:255'],
            'is_national' => ['required', 'boolean'],
            'description' => ['nullable', 'string', 'max:500'],
        ], [
            'date.required' => 'Tanggal hari libur wajib diisi.',
            'date.unique' => 'Tanggal ini sudah terdaftar sebagai hari libur.',
            'name.required' => 'Nama hari libur wajib diisi.',
        ]);

        Holiday::create($validated);

        return back()->with('success', "Hari libur '{$validated['name']}' berhasil ditambahkan ke kalender.");
    }

    /**
     * Hapus hari libur.
     */
    public function destroy(Holiday $holiday): RedirectResponse
    {
        $name = $holiday->name;
        $holiday->delete();

        return back()->with('success', "Hari libur '{$name}' berhasil dihapus dari sistem.");
    }

    /**
     * Update data hari libur.
     */
    public function update(Request $request, Holiday $holiday): RedirectResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'is_national' => 'required|boolean',
            'description' => 'nullable|string',
        ]);

        $holiday->update($validated);

        return back()->with('success', 'Hari libur berhasil diperbarui.');
    }
}
