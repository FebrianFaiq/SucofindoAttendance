<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Tampilkan daftar proyek.
     * (FR-PROJ-01)
     */
    public function index(): Response
    {
        // TODO: Pass paginated project list
        return Inertia::render('admin/projects/index');
    }

    /**
     * Tampilkan form tambah proyek.
     */
    public function create(): Response
    {
        return Inertia::render('admin/projects/create');
    }

    /**
     * Simpan proyek baru.
     */
    public function store(Request $request)
    {
        // TODO: Implement project creation
        return redirect()->route('admin.projects.index');
    }

    /**
     * Tampilkan form edit proyek.
     */
    public function edit(string $project): Response
    {
        // TODO: Pass project data
        return Inertia::render('admin/projects/edit');
    }

    /**
     * Update data proyek.
     */
    public function update(Request $request, string $project)
    {
        // TODO: Implement project update
        return redirect()->route('admin.projects.index');
    }

    /**
     * Hapus proyek.
     */
    public function destroy(string $project)
    {
        // TODO: Implement project delete
        return redirect()->route('admin.projects.index');
    }
}
