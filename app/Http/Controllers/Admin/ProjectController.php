<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        $projects = Project::withCount('employees')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('admin/projects/index', [
            'projects' => $projects,
        ]);
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
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        Project::create($request->validated());

        return redirect()->route('admin.projects.index')
            ->with('success', 'Proyek berhasil ditambahkan.');
    }

    /**
     * Tampilkan detail proyek.
     */
    public function show(Project $project): Response
    {
        $project->load([
            'employees' => function ($query) {
                $query->wherePivot('status', 'active')
                      ->with('user:id,name,email,role,is_active');
            }
        ]);

        $availableEmployees = \App\Models\Employee::with(['user:id,name,email,role', 'projects' => function($q) {
            $q->where('employee_projects.status', 'active');
        }])
        ->whereHas('user', function($q) {
            $q->where('is_active', true)->where('role', 'employee');
        })->get();

        return Inertia::render('admin/projects/show', [
            'project' => $project,
            'availableEmployees' => $availableEmployees,
        ]);
    }

    /**
     * Tampilkan form edit proyek.
     */
    public function edit(Project $project): Response
    {
        return Inertia::render('admin/projects/edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update data proyek.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('projects', 'code')->ignore($project->id)],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $project->update($validated);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Proyek berhasil diperbarui.');
    }

    /**
     * Hapus proyek (soft delete).
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('success', 'Proyek berhasil dihapus.');
    }
}
