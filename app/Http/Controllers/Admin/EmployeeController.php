<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEmployeeRequest;
use App\Http\Requests\Admin\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\EmployeeProject;
use App\Models\EmployeeSalary;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    private const DEFAULT_PASSWORD = '123';

    /**
     * Tampilkan daftar karyawan.
     * (FR-EMP)
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $employees = Employee::with(['user', 'projects' => function ($query) {
            $query->wherePivot('status', 'active');
        }, 'salaries' => function ($query) {
            $query->active();
        }])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nik', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Tampilkan form tambah karyawan.
     * (FR-EMP-01)
     */
    public function create(): Response
    {
        $projects = Project::active()->orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/employees/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Simpan karyawan baru.
     * Membuat akun dengan password default (123), flag must_change_password = true.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $role = $validated['role'] ?? 'employee';

            // 1. Buat akun user dengan password default
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(self::DEFAULT_PASSWORD),
                'role' => $role,
                'must_change_password' => true,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // 2. Buat profil karyawan (dengan divisi jika intern)
            $employee = Employee::create([
                'user_id' => $user->id,
                'nik' => $validated['nik'],
                'division' => $role === 'intern' ? ($validated['division'] ?? null) : null,
                'phone' => $validated['phone'] ?? null,
            ]);

            // 3. Assign ke proyek jika diberikan dan role adalah employee (FR-EMP-04)
            if ($role === 'employee' && ! empty($validated['project_id'])) {
                EmployeeProject::create([
                    'employee_id' => $employee->id,
                    'project_id' => $validated['project_id'],
                    'status' => 'active',
                    'assigned_at' => today(),
                    'assigned_by' => Auth::id(),
                ]);
            }

            // 4. Buat record gaji awal jika role employee dan base_salary diisi
            if ($role === 'employee' && ! empty($validated['base_salary'])) {
                EmployeeSalary::create([
                    'employee_id' => $employee->id,
                    'base_salary' => $validated['base_salary'],
                    'effective_date' => today(),
                    'notes' => 'Gaji awal saat pendaftaran',
                    'created_by' => Auth::id(),
                ]);
            }
        });

        return redirect()->route('admin.employees.index')
            ->with('success', 'Data Karyawan Berhasil di Tambahkan (Password default: '.self::DEFAULT_PASSWORD.')');
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
        $employee->load(['user', 'projects' => function ($query) {
            $query->wherePivot('status', 'active');
        }]);

        $projects = Project::active()->orderBy('name')->get(['id', 'name', 'code']);

        // Ambil gaji aktif
        $activeSalary = $employee->activeSalary();

        return Inertia::render('admin/employees/edit', [
            'employee' => $employee,
            'projects' => $projects,
            'activeSalary' => $activeSalary,
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
            $role = $validated['role'] ?? $employee->user->role;

            // 1. Update user data (termasuk role & is_active)
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $role,
                'is_active' => $validated['is_active'] ?? $employee->user->is_active,
            ];

            $employee->user->update($userData);

            // 2. Update employee data
            $employee->update([
                'nik' => $validated['nik'],
                'division' => $role === 'intern' ? ($validated['division'] ?? null) : null,
                'phone' => $validated['phone'] ?? $employee->phone,
            ]);

            // 3. Handle project assignment
            $currentActiveAssignment = EmployeeProject::where('employee_id', $employee->id)
                ->where('status', 'active')
                ->first();

            if ($role === 'intern') {
                // Anak magang tidak memiliki proyek, akhiri assignment yang ada jika ada
                if ($currentActiveAssignment) {
                    $currentActiveAssignment->update([
                        'status' => 'ended',
                        'ended_at' => today(),
                    ]);
                }
            } else {
                $newProjectId = $validated['project_id'] ?? null;

                if ($newProjectId) {
                    if (! $currentActiveAssignment || $currentActiveAssignment->project_id != $newProjectId) {
                        // Akhiri assignment lama jika ada
                        if ($currentActiveAssignment) {
                            $currentActiveAssignment->update([
                                'status' => 'ended',
                                'ended_at' => today(),
                            ]);
                        }

                        // Buat assignment baru
                        EmployeeProject::create([
                            'employee_id' => $employee->id,
                            'project_id' => $newProjectId,
                            'status' => 'active',
                            'assigned_at' => today(),
                            'assigned_by' => Auth::id(),
                        ]);
                    }
                } elseif ($currentActiveAssignment) {
                    // Jika project_id dikosongkan, nonaktifkan assignment aktif
                    $currentActiveAssignment->update([
                        'status' => 'ended',
                        'ended_at' => today(),
                    ]);
                }
            }

            // 4. Handle salary update (hanya untuk employee)
            if ($role === 'employee' && isset($validated['base_salary'])) {
                $currentSalary = $employee->activeSalary();
                $newSalary = (float) $validated['base_salary'];

                // Hanya buat record baru jika gaji berubah atau belum ada
                if (! $currentSalary || (float) $currentSalary->base_salary !== $newSalary) {
                    // Akhiri gaji lama
                    if ($currentSalary) {
                        $currentSalary->update(['ended_at' => today()]);
                    }

                    // Buat record gaji baru
                    EmployeeSalary::create([
                        'employee_id' => $employee->id,
                        'base_salary' => $newSalary,
                        'effective_date' => today(),
                        'notes' => $currentSalary ? 'Perubahan gaji' : 'Gaji awal',
                        'created_by' => Auth::id(),
                    ]);
                }
            }
        });

        return redirect()->route('admin.employees.index')
            ->with('success', 'Perubahan Berhasil di Simpan');
    }

    /**
     * Hapus karyawan dan user terkait.
     * (FR-EMP-03)
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        DB::transaction(function () use ($employee) {
            $user = $employee->user;

            // Hapus record employee dan relasinya (cascade)
            $employee->delete();

            // Hapus record user
            if ($user) {
                $user->delete();
            }
        });

        return redirect()->route('admin.employees.index')
            ->with('success', 'Data karyawan berhasil dihapus.');
    }
}
