<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEmployeeRequest;
use App\Http\Requests\Admin\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\EmployeeProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Default password untuk pegawai baru.
     */
    private const DEFAULT_PASSWORD = 'sucofindo123';

    /**
     * Tampilkan daftar karyawan.
     * (FR-EMP)
     */
    public function index(): Response
    {
        $employees = Employee::with(['user', 'projects' => function ($query) {
            $query->wherePivot('status', 'active');
        }])
            ->paginate(15);

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
        ]);
    }

    /**
     * Tampilkan form tambah karyawan.
     * (FR-EMP-01)
     */
    public function create(): Response
    {
        $projects = Project::active()->get(['id', 'name', 'code']);

        return Inertia::render('admin/employees/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Simpan karyawan baru.
     * Membuat akun dengan password default, flag must_change_password = true.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request) {
            // 1. Buat akun user dengan password default
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(self::DEFAULT_PASSWORD),
                'role' => 'employee',
                'must_change_password' => true,
                'is_active' => true,
            ]);

            // 2. Buat profil karyawan
            $employee = Employee::create([
                'user_id' => $user->id,
                'employee_code' => $validated['employee_code'],
                'nik' => $validated['nik'],
                'phone' => $validated['phone'] ?? null,
            ]);

            // 3. Assign ke proyek jika diberikan (FR-EMP-04)
            if (! empty($validated['project_id'])) {
                EmployeeProject::create([
                    'employee_id' => $employee->id,
                    'project_id' => $validated['project_id'],
                    'status' => 'active',
                    'assigned_at' => today(),
                    'assigned_by' => Auth::id(),
                ]);
            }
        });

        return redirect()->route('admin.employees.index')
            ->with('success', 'Karyawan berhasil ditambahkan. Password default: ' . self::DEFAULT_PASSWORD);
    }

    /**
     * Tampilkan detail karyawan + penugasan proyek.
     * (FR-EMP-04, FR-EMP-05)
     */
    public function show(Employee $employee): Response
    {
        $employee->load(['user', 'projects']);

        return Inertia::render('admin/employees/show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Tampilkan form edit karyawan.
     * (FR-EMP-02)
     */
    public function edit(Employee $employee): Response
    {
        $employee->load('user');

        return Inertia::render('admin/employees/edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update data karyawan.
     * (FR-EMP-02)
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $employee) {
            // Update user data
            $employee->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'is_active' => $validated['is_active'] ?? $employee->user->is_active,
            ]);

            // Update employee data
            $employee->update([
                'employee_code' => $validated['employee_code'],
                'nik' => $validated['nik'],
                'phone' => $validated['phone'] ?? $employee->phone,
            ]);
        });

        return redirect()->route('admin.employees.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    /**
     * Nonaktifkan karyawan (soft-disable via is_active).
     * (FR-EMP-03)
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        DB::transaction(function () use ($employee) {
            // Nonaktifkan akun user
            $employee->user->update(['is_active' => false]);

            // End semua assignment aktif
            EmployeeProject::where('employee_id', $employee->id)
                ->where('status', 'active')
                ->update([
                    'status' => 'ended',
                    'ended_at' => today(),
                ]);
        });

        return redirect()->route('admin.employees.index')
            ->with('success', 'Karyawan berhasil dinonaktifkan.');
    }
}
