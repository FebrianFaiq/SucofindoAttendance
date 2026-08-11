<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Dashboard Web Admin.
 * Ref: BE Framework §7.0 — GET /dashboard → Dashboard/Index.tsx
 *
 * Placeholder — logika KPI summary akan diimplementasikan di tahap FR-ADM.
 */
class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard admin.
     *
     * GET /dashboard
     */
    public function index(Request $request)
    {
        // Redirect ke dashboard admin yang sudah dislicing
        return redirect()->route('admin.dashboard');
    }
}
