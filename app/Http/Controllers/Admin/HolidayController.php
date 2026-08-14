<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
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
}
