<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Tampilkan daftar karyawan.
     * (FR-EMP)
     */
    public function index(): Response
    {
        // TODO: Pass paginated employee list
        return Inertia::render('admin/employees/index');
    }

    /**
     * Tampilkan form tambah karyawan.
     * (FR-EMP-01)
     */
    public function create(): Response
    {
        // TODO: Pass available projects for initial assignment
        return Inertia::render('admin/employees/create');
    }

    /**
     * Simpan karyawan baru.
     * Membuat akun dengan password sementara, flag must_change_password = true.
     */
    public function store(Request $request)
    {
        // TODO: Implement employee creation
        // 1. Validate: name, email, employee_id, initial_project (optional)
        // 2. Create user with temporary password
        // 3. Set must_change_password = true
        // 4. Assign to project if provided (FR-EMP-04)

        return redirect()->route('admin.employees.index');
    }

    /**
     * Tampilkan detail karyawan + penugasan proyek.
     * (FR-EMP-04, FR-EMP-05)
     */
    public function show(string $employee): Response
    {
        // TODO: Pass employee data with project assignments
        return Inertia::render('admin/employees/show');
    }

    /**
     * Tampilkan form edit karyawan.
     * (FR-EMP-02)
     */
    public function edit(string $employee): Response
    {
        // TODO: Pass employee data
        return Inertia::render('admin/employees/edit');
    }

    /**
     * Update data karyawan.
     * (FR-EMP-02)
     */
    public function update(Request $request, string $employee)
    {
        // TODO: Implement employee update
        return redirect()->route('admin.employees.index');
    }

    /**
     * Nonaktifkan / hapus karyawan.
     * (FR-EMP-03)
     */
    public function destroy(string $employee)
    {
        // TODO: Implement soft-disable/delete
        return redirect()->route('admin.employees.index');
    }
}
