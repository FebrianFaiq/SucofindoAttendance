<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignmentRequest;
use App\Models\EmployeeProject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    /**
     * Assign karyawan ke proyek.
     * (FR-EMP-04)
     */
    public function store(AssignmentRequest $request): RedirectResponse
    {
        $projectId = $request->validated('project_id');
        $employeeIds = $request->validated('employee_ids') ?? [];

        foreach ($employeeIds as $employeeId) {
            EmployeeProject::create([
                'employee_id' => $employeeId,
                'project_id' => $projectId,
                'status' => 'active',
                'assigned_at' => today(),
                'assigned_by' => Auth::id(),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Karyawan berhasil ditugaskan ke proyek.');
    }

    /**
     * Update penugasan proyek (akhiri assignment).
     * (FR-EMP-05)
     */
    public function update(Request $request, EmployeeProject $assignment): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,ended'],
        ]);

        $assignment->update([
            'status' => $validated['status'],
            'ended_at' => $validated['status'] === 'ended' ? today() : null,
        ]);

        return redirect()->back()
            ->with('success', 'Status penugasan berhasil diperbarui.');
    }

    /**
     * Akhiri penugasan proyek.
     */
    public function destroy(EmployeeProject $assignment): RedirectResponse
    {
        $assignment->update([
            'status' => 'ended',
            'ended_at' => today(),
        ]);

        return redirect()->back()
            ->with('success', 'Penugasan proyek berhasil diakhiri.');
    }
}
