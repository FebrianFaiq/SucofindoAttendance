<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    /**
     * Assign karyawan ke proyek.
     * (FR-EMP-04)
     */
    public function store(Request $request)
    {
        // TODO: Implement project assignment
        // 1. Validate: employee_id, project_id
        // 2. Create assignment record
        // 3. Mark as active

        return redirect()->back();
    }

    /**
     * Update penugasan proyek (mis. ubah status aktif).
     * (FR-EMP-05)
     */
    public function update(Request $request, string $assignment)
    {
        // TODO: Implement assignment update
        return redirect()->back();
    }

    /**
     * Hapus penugasan proyek.
     */
    public function destroy(string $assignment)
    {
        // TODO: Implement assignment removal
        return redirect()->back();
    }
}
