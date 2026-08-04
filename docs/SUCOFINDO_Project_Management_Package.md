# SUCOFINDO Attendance Management System
## Project Management Package

**Prepared by:** Technical Project Management (acting as Senior TPM advisor)
**Project Duration:** ~2 months (mentor-allowed) — optimized to a 6-week core delivery + 2-week buffer
**Team Size:** 3 (Dzaky – PM/UI-UX, Ebedt – Frontend/Mobile, Febri – Backend)
**Methodology:** Agile (lightweight Scrum, 1-week sprints, adapted for a 3-person team)

---

> **A note on team reality before anything else:** This is a 3-person team where one person (Dzaky) splits time between Project Management and UI/UX design, one person (Ebedt) is the *only* frontend resource covering **both** the Laravel Web Admin/Employee UI **and** the Flutter mobile app, and one person (Febri) is the *only* backend resource covering the Laravel API, database, and the clone-from-headquarters sync. This package is built around that constraint — sequencing, sprint scope, and risk mitigation all assume **no parallel frontend work streams** and **no dedicated QA**. Treat this as a small, real-world constrained team, not an idealized 6-person squad.

---

## 1. Work Breakdown Structure (WBS)

```
0. SUCOFINDO Attendance Management System (PTT/Project Employees)
├── 1. Planning
│   ├── 1.1 Kickoff & role confirmation
│   ├── 1.2 PRD v1.0 walkthrough & sign-off with mentor
│   ├── 1.3 Monorepo & tooling setup (repo, CI skeleton, environments)
│   └── 1.4 Sprint 0 planning & backlog creation
├── 2. Analysis
│   ├── 2.1 Functional requirement breakdown (from PRD FR-* codes)
│   ├── 2.2 Data model analysis (Employee, Project, Attendance, Overtime)
│   ├── 2.3 Open Technical Decisions resolution (PRD Section 19)
│   └── 2.4 API contract definition (endpoints, payloads, auth)
├── 3. Design
│   ├── 3.1 ERD (Entity Relationship Diagram)
│   ├── 3.2 Architecture diagram (monorepo, API, mobile, admin web, DB clone)
│   ├── 3.3 Wireframes — Employee Mobile
│   ├── 3.4 Wireframes — Employee Web
│   ├── 3.5 Wireframes — Admin Dashboard
│   └── 3.6 UI Kit / design tokens (colors, typography, components)
├── 4. Development
│   ├── 4.1 Backend — Authentication & Password Policy
│   ├── 4.2 Backend — Employee & Project Management
│   ├── 4.3 Backend — Attendance (Check In/Out, Photo, GPS, WFO/WFA)
│   ├── 4.4 Backend — Overtime
│   ├── 4.5 Backend — Dashboard & Monitoring Aggregation
│   ├── 4.6 Backend — Export (CSV/Excel)
│   ├── 4.7 Backend — Database Clone Sync Job
│   ├── 4.8 Frontend — Web Admin (all modules)
│   ├── 4.9 Frontend — Employee Web (attendance flows)
│   └── 4.10 Frontend — Mobile App (Flutter, attendance flows)
├── 5. Testing
│   ├── 5.1 Manual test case writing (per feature)
│   ├── 5.2 Functional testing (Auth, Attendance, Overtime, Admin)
│   ├── 5.3 Cross-device testing (Android, common browsers)
│   ├── 5.4 Edge case & validation testing (GPS off, camera denied, offline)
│   └── 5.5 UAT with mentor/HRD
├── 6. Deployment
│   ├── 6.1 Local environment finalization
│   ├── 6.2 Deployment package prep (build, env config)
│   ├── 6.3 Company server deployment (post-approval)
│   └── 6.4 Post-deployment smoke test
└── 7. Documentation
    ├── 7.1 PRD (already delivered, v1.0)
    ├── 7.2 ERD & API Documentation
    ├── 7.3 Architecture Diagram
    ├── 7.4 User Flow & Wireframes
    ├── 7.5 Meeting Notes (ongoing)
    ├── 7.6 Deployment Guide
    ├── 7.7 README
    ├── 7.8 Testing Report
    └── 7.9 User Manual (Employee & Admin)
```

---

## 2. Development Roadmap

The roadmap is sequenced deliberately — each phase unlocks the next, and with only one FE and one BE resource, **order of operations determines whether the team ever gets blocked waiting on each other.**

| Order | Phase | Why It Comes First |
|---|---|---|
| 1 | **PRD sign-off + Open Technical Decisions resolved** | Every downstream artifact (ERD, API, wireframes) depends on settled decisions like DB engine, image storage, and multi-project tagging logic. Starting design before this is settled means redoing work. |
| 2 | **ERD & API Contract** | Febri (backend) cannot build endpoints without a data model. Ebedt (frontend) cannot build any screen without knowing what the API returns. Defining this first lets both start work in parallel from Sprint 1 onward instead of Ebedt waiting on Febri to "finish the backend" as one big block. |
| 3 | **Wireframes (Dzaky)** | Runs *in parallel* with ERD/API work since it doesn't depend on backend decisions — only on the PRD. This is why Dzaky's dual PM/UI-UX role is scheduled to front-load design work in Sprint 0–1, before PM duties (sprint tracking, blockers) become heavier. |
| 4 | **Authentication & Core Data Foundation** | Every other feature (Attendance, Overtime, Admin) requires a logged-in user with a role and, in the Employee's case, an active Project assignment. Building anything else first would mean mocking auth repeatedly and rebuilding later. |
| 5 | **Employee & Project Management (Admin side)** | Attendance records need an Employee and an active Project to attach to. Without this, Attendance development has no real data to test against — QA would be testing against fake/hardcoded data, hiding real bugs. |
| 6 | **Attendance Core (Check In/Out, Photo, GPS, WFO/WFA, Work Summary)** | This is the single most business-critical feature and the most technically risky (camera + GPS + file upload + offline handling). It gets the largest sprint allocation and starts as early as the data foundation allows, so there's maximum time to handle edge cases before deployment. |
| 7 | **Overtime** | Structurally simpler than Attendance (no photo/GPS, pure form input) and depends only on the same Employee/Project foundation — safe to build once Attendance patterns (forms, validation, API auth) are proven. |
| 8 | **Admin Dashboard & Monitoring** | Needs real Attendance and Overtime data to aggregate against (KPI cards, flags, filters) — building this earlier would mean testing against empty/fake data. |
| 9 | **Monthly Export (CSV/Excel)** | Lowest technical risk, depends on Dashboard's data queries already being correct — natural last feature before hardening. |
| 10 | **Testing, Deployment, Documentation** | Runs as a dedicated hardening phase, with manual testing happening continuously per feature (see Section 5) but a final concentrated pass before company-server deployment. |

---

## 3. Agile Sprint Planning

Sprints are **1 week each** (Mon–Fri, 08:00–16:00), aligned to the 6-week core delivery target with buffer in Weeks 7–8.

### Sprint 0 — Foundation (Week 1)
**Objectives**
- Finalize Open Technical Decisions from PRD Section 19 (DB engine, image storage, password rules, monorepo structure).
- Set up monorepo, environments (local dev for all 3 members), and CI skeleton.
- Produce ERD and API contract draft.
- Produce wireframes for Login, First-Login Password Change, Check In/Out, Admin Dashboard.

**Deliverables**
- Monorepo initialized with folder structure (`/backend`, `/admin-web`, `/mobile`, `/docs`).
- ERD v1 (Employee, Project, Attendance, Overtime tables).
- API contract v1 (endpoint list + payload shapes, not yet implemented).
- Wireframes for core flows.
- Sprint 1 backlog groomed and estimated.

**Dependencies**
- Requires PRD v1.0 (already delivered) and mentor availability to resolve Open Technical Decisions.

---

### Sprint 1 — Authentication & Core Data Foundation (Week 2)
**Objectives**
- Implement Authentication end-to-end (Login, Forced First-Login Password Change, Admin Reset/Change Password).
- Implement Employee & Project database schema and core CRUD APIs.
- Start Web Admin shell (layout, navigation, login screen) since it's faster to build than Flutter and unblocks Admin-side testing early.

**Deliverables**
- `FR-AUTH-01` to `FR-AUTH-04` functional (backend + Web Admin UI, mobile login screen if time allows).
- `FR-EMP-01` to `FR-EMP-05` backend complete (Employee CRUD, project assignment, password reset).
- Admin Web shell deployed to local environment.

**Dependencies**
- Requires ERD & API contract from Sprint 0.
- Ebedt is the bottleneck here — Web Admin UI work directly competes with starting Mobile login screen. Prioritize Web Admin first (see Roadmap rationale).

---

### Sprint 2 — Attendance Core (Week 3)
**Objectives**
- Build the most business-critical and highest-risk feature: Check In/Check Out with Photo, GPS, WFO/WFA selection, and mandatory Work Summary at checkout.
- Implement on **Employee Web first**, then start Mobile in parallel toward the end of the sprint if capacity allows.

**Deliverables**
- `FR-ATT-01` to `FR-ATT-04` backend complete.
- Employee Web attendance flow (Check In, Check Out, History) functional end-to-end.
- Mobile app skeleton with camera + GPS permission handling started.

**Dependencies**
- Requires Employee & Project data (Sprint 1) so attendance records have something real to attach to.
- Requires Open Technical Decision on image storage (Sprint 0) before upload logic can be finalized.

---

### Sprint 3 — Mobile Completion, Overtime, Flag Logic (Week 4)
**Objectives**
- Complete Mobile attendance flow (Check In/Out, Photo, GPS, WFO/WFA, Work Summary) — this is the sprint most likely to need the buffer weeks if delayed.
- Implement Overtime feature (form-based, lower risk than Attendance).
- Implement simple Flag logic (Not Checked In / Checked In / Checked Out / WFO / WFA / Late).

**Deliverables**
- Mobile app attendance flow functional and manually tested on at least one Android device.
- `FR-OVT-01` to `FR-OVT-03` complete (entry, HRD list view, configurable threshold alert).
- `FR-FLAG-01` complete and visible in a basic Admin table view.

**Dependencies**
- Requires Attendance Web flow (Sprint 2) as the reference implementation for Mobile.
- Requires Employee/Project foundation for Overtime's auto-project-tagging.

---

### Sprint 4 — Admin Dashboard, Monitoring & Export (Week 5)
**Objectives**
- Build the Admin Dashboard: 7 KPI cards, filters (Date/Employee/Project), attendance table.
- Build Monthly Export (CSV/Excel) with the same filters.
- Begin database clone sync job (if not already scaffolded in Sprint 0/1).

**Deliverables**
- `FR-ADM-01` to `FR-ADM-03` complete.
- `FR-EXP-01` complete (CSV + Excel export, filterable).
- `FR-SYS-01` clone sync job running against a test/staging source.

**Dependencies**
- Requires real Attendance and Overtime data (Sprints 2–3) to populate meaningful KPIs and exports.

---

### Sprint 5 (Hardening Week) — Integration, Bug Fixing, UAT Prep (Week 6)
**Objectives**
- Full regression pass across Web Admin, Employee Web, and Mobile.
- Fix bugs surfaced by manual testing.
- Prepare UAT session materials for mentor/HRD.

**Deliverables**
- All features integrated and manually tested end-to-end.
- Bug list triaged and closed (or explicitly deferred with mentor sign-off).
- UAT conducted with at least one real HRD/mentor walkthrough.

**Dependencies**
- Requires all feature sprints (1–4) substantially complete; this sprint exists specifically to absorb slippage from Sprint 3 (Mobile) if it runs long.

> **Weeks 7–8 are intentionally unscheduled buffer** — reserved for: UAT feedback fixes, company-server deployment (Section 6 of WBS), final documentation, and handover. See Section 4 for how this buffer is allocated if unused.

---

## 4. Timeline (8 Weeks)

| Week | Focus | Primary Owner(s) | Status Target by End of Week |
|---|---|---|---|
| **Week 1** | Sprint 0 — Foundation, ERD, API contract, wireframes | All 3 | Environment ready, design artifacts approved |
| **Week 2** | Sprint 1 — Auth, Employee/Project backend, Admin Web shell | Febri (BE), Ebedt (FE) | Login + Employee Management usable end-to-end |
| **Week 3** | Sprint 2 — Attendance Core (Web first) | Febri, Ebedt | Employee Web can Check In/Out fully |
| **Week 4** | Sprint 3 — Mobile completion, Overtime, Flags | Ebedt (Mobile), Febri (BE) | Mobile attendance functional; Overtime functional |
| **Week 5** | Sprint 4 — Admin Dashboard, Export, Clone sync | Febri, Ebedt, Dzaky (QA support) | Dashboard + Export usable; clone job running |
| **Week 6** | Sprint 5 — Hardening, integration testing, UAT | All 3 | Feature-complete, UAT passed |
| **Week 7** | **Buffer** — bug fixes from UAT, deployment prep | All 3 | Deployment package ready |
| **Week 8** | **Buffer** — Company server deployment, documentation, handover | All 3 | Live on company server, docs delivered |

**Why this hits "~6 weeks realistic, 8 weeks safe":** Weeks 1–6 deliver a fully feature-complete, manually-tested system. Weeks 7–8 are not padding for unfinished features — they exist because a 3-person team with one FE and one BE has **no slack for the unexpected** (a sick day, a permission bug on a specific Android version, a slow mentor approval cycle). If Weeks 1–6 go smoothly, Week 7 can be used to deploy early and Week 8 becomes true buffer/documentation polish.

---

## 5. Milestones

| # | Milestone | Target | Exit Criteria |
|---|---|---|---|
| M1 | **PRD Approved** | Pre-Week 1 | PRD v1.0 signed off by mentor (already achieved) |
| M2 | **Design Artifacts Approved** | End of Week 1 | ERD, API contract, and wireframes reviewed and approved by mentor |
| M3 | **Auth & Employee Management Ready** | End of Week 2 | Admin can create employees; employee can log in and complete forced password change |
| M4 | **Web Attendance Complete** | End of Week 3 | Employee can Check In/Out via Web with Photo + GPS + WFO/WFA + Work Summary |
| M5 | **Mobile Attendance Complete** | End of Week 4 | Same as M4, on Mobile (Flutter) |
| M6 | **Admin Dashboard & Export Ready** | End of Week 5 | KPI cards, filters, attendance table, and CSV/Excel export functional |
| M7 | **Integration & UAT Complete** | End of Week 6 | Full regression pass done; mentor/HRD UAT signed off |
| M8 | **Deployment Ready** | Week 7 | Deployment package built, tested locally, approved for company server |
| M9 | **Live Deployment & Handover** | Week 8 | System live on company server, documentation package delivered, PKL handover complete |

---

## 6. Task Breakdown (Per Feature, Per Engineering Discipline)

Each feature is broken into: **Database → API → Validation → Frontend → Testing → Documentation.**

### 6.1 Authentication & First-Login Password Change
| Discipline | Tasks |
|---|---|
| Database | `users` table (email, password_hash, must_change_password flag, role); migration + seeder for initial Admin account |
| API | `POST /login`, `POST /change-password`, `POST /admin/reset-password/{id}`, `POST /admin/set-password/{id}` |
| Validation | Email format, password complexity rule (per Open Technical Decision), block all non-auth endpoints until `must_change_password = false` |
| Frontend | Login screen (Web + Mobile), forced Change Password screen with redirect guard, Admin password reset/change UI |
| Testing | Valid/invalid login, forced redirect on first login, cannot bypass via direct URL, Admin reset flow end-to-end |
| Documentation | API docs for auth endpoints, README section on default admin credentials for local dev |

### 6.2 Employee Management
| Discipline | Tasks |
|---|---|
| Database | `employees` table, foreign key to `users`, `employee_id` (NIP-style), status (active/inactive) |
| API | `GET/POST/PUT/DELETE /admin/employees`, `POST /admin/employees/{id}/disable` |
| Validation | Unique email/employee ID, required fields on create, disable vs delete behavior per Open Technical Decision |
| Frontend | Employee list, add/edit form, disable/delete action with confirmation modal |
| Testing | CRUD happy path, duplicate email rejection, disabled employee cannot log in |
| Documentation | Admin User Manual section: "Managing Employees" |

### 6.3 Project Assignment
| Discipline | Tasks |
|---|---|
| Database | `projects` table, `employee_project` pivot table with `is_active` flag |
| API | `GET/POST /admin/projects`, `POST /admin/employees/{id}/assign-project`, `PUT /admin/employees/{id}/reassign-project` |
| Validation | At least one active project per employee (or explicitly none, per Open Technical Decision on multi-project handling) |
| Frontend | Project assignment tab on Employee detail page, project picker |
| Testing | Assign, reassign, verify historical assignment retained, verify attendance auto-tags correct project |
| Documentation | Admin User Manual section: "Assigning Projects"; note on multi-project edge case handling |

### 6.4 Attendance — Check In / Check Out
| Discipline | Tasks |
|---|---|
| Database | `attendances` table (employee_id, project_id, type WFO/WFA, check_in_time, check_out_time, photo_in_url, photo_out_url, gps_in, gps_out, work_summary, is_late flag) |
| API | `POST /attendance/check-in`, `POST /attendance/check-out`, `GET /attendance/today-status` |
| Validation | Prevent duplicate check-in/out same day, require photo + GPS on both actions, require non-empty work_summary on check-out, auto-flag late if check-in > 08:00 (never reject) |
| Frontend (Web) | Check In/Out screens with camera capture, GPS capture, WFO/WFA selector, work summary field on checkout |
| Frontend (Mobile) | Same flow in Flutter, including camera/GPS permission request UX and offline-retry handling |
| Testing | Photo/GPS mandatory enforcement, duplicate prevention, late-flag logic (before/after 08:00), permission-denied edge cases, offline submit retry |
| Documentation | User Manual section: "How to Check In / Check Out"; API docs for attendance endpoints |

### 6.5 Attendance History
| Discipline | Tasks |
|---|---|
| Database | (uses `attendances` table, indexed by employee_id + date) |
| API | `GET /attendance/history?employee_id=` |
| Validation | Employee can only fetch their own history (authorization check) |
| Frontend | History list screen (Web + Mobile), detail view per record |
| Testing | Correct filtering, no cross-employee data leakage |
| Documentation | User Manual section: "Viewing Attendance History" |

### 6.6 Manual Overtime
| Discipline | Tasks |
|---|---|
| Database | `overtimes` table (employee_id, project_id, date, start_time, end_time, duration, description) |
| API | `POST /overtime`, `GET /admin/overtime`, `GET/PUT /admin/overtime/threshold` |
| Validation | Required fields, duration consistency with start/end time, no approval gate (data-only) |
| Frontend | Overtime entry form (Employee), Overtime list + threshold config (Admin) |
| Testing | Entry saved correctly, threshold alert triggers correctly when exceeded, no approval step present |
| Documentation | User Manual: "Logging Overtime"; Admin Manual: "Configuring Overtime Alerts" |

### 6.7 Admin Dashboard & Attendance Monitoring
| Discipline | Tasks |
|---|---|
| Database | (aggregation queries over `attendances`, `overtimes`, `employees`) |
| API | `GET /admin/dashboard/kpi`, `GET /admin/dashboard/attendance-table?date=&employee=&project=` |
| Validation | Filter correctness (date range, employee, project), performance of aggregation queries |
| Frontend | 7 KPI cards, filter bar, attendance table with Flag column |
| Testing | KPI counts match manual calculation on test data, filters combine correctly |
| Documentation | Admin Manual: "Reading the Dashboard" |

### 6.8 Monthly Export (CSV / Excel)
| Discipline | Tasks |
|---|---|
| Database | (reuses dashboard aggregation queries) |
| API | `GET /admin/export?format=csv|excel&month=&employee=&project=` |
| Validation | Correct filtering applied to export, file generation doesn't time out on full-month data |
| Frontend | Export button + filter selection, format picker (CSV/Excel) |
| Testing | Exported file opens correctly, data matches on-screen table, filters respected in export |
| Documentation | Admin Manual: "Exporting Monthly Reports" |

### 6.9 Database Clone Sync (Headquarters)
| Discipline | Tasks |
|---|---|
| Database | Sync job/script, mapping table between HQ source fields and local schema |
| API | Internal sync job (scheduled or manual trigger), not user-facing |
| Validation | Handle partial sync failure gracefully, log discrepancies |
| Frontend | (Admin) simple "Last synced at" indicator on Dashboard |
| Testing | Manual trigger test against sample HQ data export, verify no duplicate/orphaned records |
| Documentation | Deployment Guide section: "Database Clone Sync Setup" |

---

## 7. Responsibility Matrix (RACI)

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

| Activity / Deliverable | Dzaky (PM/UI-UX) | Ebedt (Frontend/Mobile) | Febri (Backend) |
|---|---|---|---|
| PRD sign-off & scope changes | A | C | C |
| Sprint planning & backlog grooming | A/R | C | C |
| ERD & Database Schema | C | I | A/R |
| API Contract Definition | C | C | A/R |
| Wireframes & UI Kit | A/R | C | I |
| Architecture Diagram | C | C | A/R |
| Backend Development (all modules) | I | I | A/R |
| Web Admin Frontend | C | A/R | I |
| Employee Web Frontend | C | A/R | I |
| Mobile App (Flutter) | C | A/R | I |
| Manual Testing Execution | R | R | R |
| Bug Triage & Prioritization | A | C | C |
| Deployment (local) | I | R | A/R |
| Deployment (company server) | A | C | R |
| Documentation (PRD, User Manual) | A/R | C | C |
| Documentation (API docs, Deployment Guide) | I | C | A/R |
| Stakeholder / Mentor Communication | A/R | I | I |
| UAT Coordination | A/R | C | C |

---

## 8. Risk Register

| # | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| 1 | Requirement changes after Sprint 1 (mentor/HRD raises new needs) | High | Medium | PRD v1.0 already frozen with explicit Out of Scope list (Section 8) and Open Technical Decisions (Section 19) called out separately; new requests get logged as Future Enhancement, not silently absorbed mid-sprint |
| 2 | Backend delay (Febri is the sole backend resource — single point of failure) | High | Medium | Sequence backend-first per Roadmap (Section 2); if Febri falls behind, Web Admin UI (Ebedt) can continue against the already-agreed API contract using mocked responses |
| 3 | Frontend/Mobile delay (Ebedt is the sole resource for Web Admin, Employee Web, *and* Mobile) | High | High | This is the team's biggest structural risk — explicitly why Sprint 3 (Mobile) is positioned right before the hardening sprint, and why Weeks 7–8 exist as buffer specifically to absorb Mobile slippage |
| 4 | Integration issues between Web Admin, Employee Web, and Mobile against the same API | Medium | Medium | API contract locked in Sprint 0 before any frontend work starts; any contract change after Sprint 1 requires explicit re-sync between Ebedt and Febri, not silent divergence |
| 5 | GPS accuracy/availability issues (indoor offices, disabled location services) | Medium | Medium | Clear error states already defined in PRD flows (retry prompts, no silent failure); tested explicitly in Sprint 2/3 |
| 6 | Camera permission denied by employee | Medium | Medium | Graceful permission-request UX with settings deep-link, tested as a dedicated case in Sprint 2/3 |
| 7 | Database clone sync issues (data drift or failure from Headquarters source) | High | Medium | Sync job logs discrepancies (Section 6.9); "last synced at" indicator keeps Admin aware of staleness rather than silently trusting bad data |
| 8 | Server deployment issues (first-time deploy to company server, unfamiliar environment) | High | Medium | Local-first deployment strategy (already mandated) means the app is proven to work before server variables are introduced; Week 7–8 buffer exists specifically for this |
| 9 | No dedicated QA — all manual testing done by the same 3 people who built the features | Medium | High | Cross-testing assigned in RACI (each person tests features they didn't build where possible); dedicated Sprint 5 hardening week for full regression, not just per-feature spot checks |
| 10 | Dzaky's dual PM/UI-UX role creates a bottleneck if design and coordination both spike at once | Medium | Medium | UI-UX work is front-loaded into Sprint 0–1 (before heavy PM coordination is needed); wireframes for all core screens are locked before Sprint 2 |
| 11 | Working-hours constraint (08:00–16:00 only, no stated overtime for the team itself) limits ability to "crash" the schedule under slippage | Medium | Low | This is precisely why the 8-week timeline keeps 2 full weeks of buffer rather than assuming a compressed crunch is available |
| 12 | Multi-active-project attendance tagging logic is an Open Technical Decision (PRD Section 19) — could resurface as a design gap mid-sprint | Medium | Medium | Flagged explicitly for resolution in Sprint 0 before Employee/Project development (Sprint 1) begins |

---

## 9. Definition of Done

A feature is **Done** only when every applicable line below is checked. Given manual-only testing and no dedicated QA, "Reviewed" means reviewed by at least one teammate who did not write the code.

### Authentication
- [ ] Database schema implemented and migrated
- [ ] API endpoints implemented (login, change-password, admin reset/set)
- [ ] Forced first-login redirect cannot be bypassed via direct URL
- [ ] Frontend implemented on Web and Mobile
- [ ] Manual testing passed (valid/invalid login, forced change, admin reset)
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Employee Management
- [ ] Database schema implemented and migrated
- [ ] CRUD API endpoints implemented
- [ ] Disable/delete behavior matches Open Technical Decision
- [ ] Admin Web frontend implemented
- [ ] Manual testing passed (CRUD happy path, duplicate rejection, disabled login block)
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Project Assignment
- [ ] Database schema implemented (including multi-active-project support)
- [ ] API endpoints implemented (assign, reassign)
- [ ] Admin Web frontend implemented
- [ ] Manual testing passed (assign, reassign, history retained)
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Attendance (Check In / Check Out)
- [ ] Database schema implemented
- [ ] API endpoints implemented and enforce photo + GPS as mandatory
- [ ] Work Summary mandatory validation on checkout
- [ ] Late-flag logic implemented (never blocks submission)
- [ ] Web frontend implemented and tested
- [ ] Mobile frontend implemented and tested on at least one physical Android device
- [ ] Manual testing passed, including permission-denied and offline-retry edge cases
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Overtime
- [ ] Database schema implemented
- [ ] API endpoints implemented (entry, list, threshold config)
- [ ] No approval workflow present (confirmed out of scope)
- [ ] Frontend implemented (Employee entry form, Admin list + threshold config)
- [ ] Manual testing passed (entry saved, alert triggers correctly)
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Admin Dashboard & Monitoring
- [ ] KPI aggregation queries implemented and verified against manual calculation
- [ ] Filters (Date/Employee/Project) implemented and tested in combination
- [ ] Attendance table with Flag column implemented
- [ ] Manual testing passed
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Monthly Export
- [ ] Export endpoint implemented for CSV and Excel
- [ ] Filters applied correctly to export output
- [ ] Manual testing passed (file opens correctly, data matches dashboard)
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

### Database Clone Sync
- [ ] Sync job implemented and scheduled/triggerable
- [ ] Discrepancy logging implemented
- [ ] "Last synced at" indicator visible to Admin
- [ ] Manual testing passed against sample HQ data
- [ ] Reviewed by a teammate
- [ ] Merged to main branch

---

## 10. Trello Board Structure

### Lists
```
📥 Product Backlog
🎯 Sprint Backlog
🚧 In Progress
👀 Code Review
🧪 Testing
🚀 Ready for Deployment
✅ Done
```

### Card Template (used for every card below)
```
Title:
Description:
Checklist:
Priority: (High / Medium / Low)
Estimated Effort: (in days)
Assigned Member:
Dependencies:
Acceptance Criteria:
```

### Sample Cards (Ready to Copy Into Trello As-Is)

---
**Title:** [AUTH] Implement Login API + Forced Password Change Guard
**Description:** Build backend login endpoint and middleware that blocks all non-auth routes until `must_change_password` is false.
**Checklist:**
- [ ] `users` migration with `must_change_password` flag
- [ ] `POST /login` endpoint
- [ ] Middleware guard on protected routes
- [ ] `POST /change-password` endpoint
**Priority:** High
**Estimated Effort:** 2 days
**Assigned Member:** Febri
**Dependencies:** ERD approved (Sprint 0)
**Acceptance Criteria:**
- Given a user with `must_change_password = true`, when they call any protected endpoint other than `/change-password`, then the API returns a 403 redirect signal.
- Given valid credentials, when login is called, then a session/token is returned along with the `must_change_password` flag.

---
**Title:** [AUTH] Forced Change Password Screen (Web + Mobile)
**Description:** Build the UI screen that appears immediately after first login and cannot be dismissed or navigated away from until password is changed.
**Checklist:**
- [ ] Web screen implemented
- [ ] Mobile screen implemented
- [ ] Navigation guard prevents back/skip
- [ ] Success redirects to Dashboard/Home
**Priority:** High
**Estimated Effort:** 1.5 days
**Assigned Member:** Ebedt
**Dependencies:** [AUTH] Login API card
**Acceptance Criteria:**
- Given a first-time login, when the user lands on the app, then they are redirected to Change Password and cannot access any other screen.
- Given a successful password change, when submitted, then the user lands on Dashboard/Home.

---
**Title:** [EMP] Employee CRUD API
**Description:** Build Add/Edit/Disable/Delete endpoints for employee management.
**Checklist:**
- [ ] `employees` migration
- [ ] `POST/GET/PUT/DELETE /admin/employees`
- [ ] Disable endpoint (soft-disable per Open Technical Decision)
- [ ] Unique email/employee ID validation
**Priority:** High
**Estimated Effort:** 2 days
**Assigned Member:** Febri
**Dependencies:** ERD approved
**Acceptance Criteria:**
- Given valid employee data, when Admin submits Add Employee, then a new account is created with a temporary password and `must_change_password = true`.
- Given a duplicate email, when Admin submits Add Employee, then the API rejects with a clear validation error.

---
**Title:** [EMP] Employee Management UI (Admin Web)
**Description:** List, add, edit, and disable/delete employees from the Admin Web panel.
**Checklist:**
- [ ] Employee list table
- [ ] Add/Edit form
- [ ] Disable/Delete confirmation modal
- [ ] Reset password action
**Priority:** High
**Estimated Effort:** 2.5 days
**Assigned Member:** Ebedt
**Dependencies:** [EMP] Employee CRUD API
**Acceptance Criteria:**
- Given the employee list, when Admin clicks Add Employee, then a form appears and successfully creates a new employee on submit.
- Given a disabled employee, when they attempt to log in, then login is rejected.

---
**Title:** [PROJ] Project Assignment API
**Description:** Endpoints for assigning and reassigning employees to projects, supporting multiple simultaneous active projects.
**Checklist:**
- [ ] `projects` migration
- [ ] `employee_project` pivot with `is_active` flag
- [ ] Assign/reassign endpoints
- [ ] Historical assignment retained on reassignment
**Priority:** High
**Estimated Effort:** 2 days
**Assigned Member:** Febri
**Dependencies:** [EMP] Employee CRUD API, Open Technical Decision #9 resolved (multi-project tagging logic)
**Acceptance Criteria:**
- Given an employee reassigned to a new project, when their attendance history is viewed, then old records still show the project active at the time.
- Given an employee with two simultaneous active projects, when they check in, then the system applies the agreed tagging logic (per resolved technical decision).

---
**Title:** [ATT] Check In API (Photo + GPS + WFO/WFA)
**Description:** Endpoint that accepts photo upload, GPS coordinates, and WFO/WFA selection, and creates an attendance record.
**Checklist:**
- [ ] `attendances` migration
- [ ] Photo upload handling (per Open Technical Decision on storage)
- [ ] GPS coordinate storage
- [ ] Duplicate check-in prevention (same day)
- [ ] Late-flag logic (>08:00, never rejects)
**Priority:** High
**Estimated Effort:** 3 days
**Assigned Member:** Febri
**Dependencies:** [EMP]/[PROJ] APIs, image storage decision resolved
**Acceptance Criteria:**
- Given a check-in submitted after 08:00, when saved, then the record is flagged "Late" but still succeeds.
- Given a second check-in attempt same day, when submitted, then the API rejects with "Already checked in today."

---
**Title:** [ATT] Check In/Out Flow — Employee Web
**Description:** Web UI for Check In and Check Out including camera capture, GPS capture, WFO/WFA selector, and mandatory Work Summary at checkout.
**Checklist:**
- [ ] Check In screen
- [ ] Check Out screen with mandatory Work Summary field
- [ ] Camera permission handling
- [ ] GPS permission handling
- [ ] Success screen
**Priority:** High
**Estimated Effort:** 3 days
**Assigned Member:** Ebedt
**Dependencies:** [ATT] Check In API
**Acceptance Criteria:**
- Given an empty Work Summary field, when Check Out is submitted, then submission is blocked with a validation message.
- Given camera permission denied, when the user retries after enabling it, then capture proceeds normally.

---
**Title:** [ATT] Check In/Out Flow — Mobile (Flutter)
**Description:** Same functional flow as the Web version, built natively in Flutter.
**Checklist:**
- [ ] Check In screen (camera + GPS + WFO/WFA)
- [ ] Check Out screen (camera + GPS + Work Summary)
- [ ] Permission request UX with settings deep-link
- [ ] Offline submit retry (data preserved on failure)
**Priority:** High
**Estimated Effort:** 4 days
**Assigned Member:** Ebedt
**Dependencies:** [ATT] Check In/Out Flow — Employee Web (as reference implementation)
**Acceptance Criteria:**
- Given no internet connection at submit time, when connection returns, then the previously captured photo/GPS/summary is still available for retry without redoing the flow.

---
**Title:** [OVT] Manual Overtime Entry (Backend + Employee UI)
**Description:** Employee-facing form to log overtime (date, start/end time, duration, description) and backend storage.
**Checklist:**
- [ ] `overtimes` migration
- [ ] `POST /overtime` endpoint
- [ ] Employee entry form (Web + Mobile)
- [ ] No approval step present
**Priority:** Medium
**Estimated Effort:** 2 days
**Assigned Member:** Febri (API) / Ebedt (UI)
**Dependencies:** [EMP]/[PROJ] APIs
**Acceptance Criteria:**
- Given a completed overtime form, when submitted, then the entry is saved immediately without requiring any approval action.

---
**Title:** [OVT] HRD Overtime Monitoring + Threshold Alert
**Description:** Admin/HRD view of all overtime entries, with a configurable threshold that triggers a dashboard alert.
**Checklist:**
- [ ] Overtime list view (Admin)
- [ ] Threshold configuration UI
- [ ] Alert logic (accumulated hours vs threshold)
**Priority:** Medium
**Estimated Effort:** 2 days
**Assigned Member:** Febri (logic) / Ebedt (UI)
**Dependencies:** [OVT] Manual Overtime Entry
**Acceptance Criteria:**
- Given an employee's accumulated overtime exceeds the configured threshold, when the Admin Dashboard loads, then an alert is visibly displayed for that employee.

---
**Title:** [ADM] Dashboard KPI Cards + Filters
**Description:** 7 KPI cards (Total Employees, Present Today, WFO/WFA Today, Not Checked In/Out, Overtime Today) with Date/Employee/Project filters.
**Checklist:**
- [ ] Aggregation API endpoint
- [ ] KPI card components
- [ ] Filter bar (Date, Employee, Project)
**Priority:** High
**Estimated Effort:** 2.5 days
**Assigned Member:** Febri (API) / Ebedt (UI)
**Dependencies:** [ATT], [OVT] data available
**Acceptance Criteria:**
- Given a selected date, when the dashboard loads, then all 7 KPI cards reflect accurate counts for that date, verified against manual calculation.

---
**Title:** [ADM] Attendance Monitoring Table with Flags
**Description:** Table showing Employee, Project, Clock In/Out, Status, WFO/WFA, Overtime, with simple flag indicators.
**Checklist:**
- [ ] Table component with all required columns
- [ ] Flag rendering logic (Not Checked In / Checked In / Checked Out / Late / WFO / WFA)
- [ ] Filter integration with KPI filter bar
**Priority:** High
**Estimated Effort:** 2 days
**Assigned Member:** Ebedt
**Dependencies:** [ADM] Dashboard KPI Cards
**Acceptance Criteria:**
- Given an employee who checked in after 08:00, when viewed in the table, then their row/name displays the "Late" flag.

---
**Title:** [EXP] Monthly Export (CSV/Excel)
**Description:** Export attendance recap filtered by Employee/Project/Date, in CSV or Excel format.
**Checklist:**
- [ ] Export API endpoint
- [ ] CSV generation
- [ ] Excel generation
- [ ] Admin UI export button + filter/format picker
**Priority:** Medium
**Estimated Effort:** 2 days
**Assigned Member:** Febri (API) / Ebedt (UI)
**Dependencies:** [ADM] Dashboard (shared query logic)
**Acceptance Criteria:**
- Given a selected month and filter, when Export is clicked, then the downloaded file's data matches what's shown on-screen for the same filter.

---
**Title:** [SYS] Database Clone Sync Job
**Description:** Scheduled/triggerable job that clones employee (and project) data from the Headquarters database source.
**Checklist:**
- [ ] Sync script/job implemented
- [ ] Discrepancy logging
- [ ] "Last synced at" indicator on Admin Dashboard
**Priority:** High
**Estimated Effort:** 3 days
**Assigned Member:** Febri
**Dependencies:** Open Technical Decision on sync mechanism resolved
**Acceptance Criteria:**
- Given a manual sync trigger against sample HQ data, when run, then no duplicate or orphaned employee records are created.

---

## 11. Project Documentation Checklist

| # | Document | Owner | Status |
|---|---|---|---|
| 1 | PRD (v1.0) | Dzaky | ✅ Delivered |
| 2 | ERD | Febri | ⬜ Due Sprint 0 |
| 3 | API Documentation | Febri | ⬜ Due Sprint 0 (draft), updated per sprint |
| 4 | Architecture Diagram | Febri (with Dzaky review) | ⬜ Due Sprint 0 |
| 5 | User Flow | Dzaky | ✅ Delivered (User Flow Documentation v0.1, pending v1.0 sync with PRD) |
| 6 | Wireframes | Dzaky | ⬜ Due Sprint 0 |
| 7 | Meeting Notes | Dzaky (or rotating) | ⬜ Ongoing, per sprint |
| 8 | Deployment Guide | Febri | ⬜ Due Week 7 |
| 9 | README | Febri + Ebedt | ⬜ Due Sprint 0 (skeleton), finalized Week 8 |
| 10 | Testing Report | All (Dzaky compiles) | ⬜ Due Week 6 |
| 11 | User Manual (Employee + Admin) | Dzaky | ⬜ Due Week 7–8 |

---

## 12. GitHub Strategy

### Branch Strategy
Given the monorepo and 3-person team, a **simplified trunk-based flow** avoids the overhead of full GitFlow while still protecting `main`:

```
main                → always deployable, protected branch
  └── develop        → integration branch, merged into main at each milestone
        ├── feature/auth-login
        ├── feature/attendance-checkin
        ├── feature/employee-management
        ├── feature/overtime
        └── feature/admin-dashboard
```

- Feature branches are created per Trello card, named `feature/<short-description>`.
- Bug fixes use `fix/<short-description>`.
- `develop` is merged into `main` only at Sprint boundaries or milestones, after manual testing passes.

### Commit Convention
Follow **Conventional Commits** for a clear, scannable history in a small team:

```
feat: add check-in API with photo and GPS validation
fix: prevent duplicate check-in same day
chore: setup monorepo folder structure
docs: add API documentation for attendance endpoints
test: add manual test cases for overtime threshold alert
refactor: simplify employee project assignment query
```

### Pull Request Workflow
1. Open PR from `feature/*` → `develop`.
2. PR description must reference the Trello card and list what changed.
3. **At least one other team member reviews** (per Definition of Done — no self-merge).
4. Manual testing checklist from the card must be checked off before merge.
5. PR merged only after review approval.

### Merge Strategy
- Use **Squash and Merge** for feature branches into `develop` — keeps history clean and each squashed commit maps to one Trello card.
- Use **Merge Commit** (no squash) for `develop` → `main` — preserves the sprint's full commit history for traceability.

### Release Tagging
Tag `main` at each deployment milestone using semantic-style tags:

```
v0.1.0 — Sprint 0 environment/setup complete (internal only, not deployed)
v0.2.0 — Auth + Employee/Project management complete
v0.3.0 — Attendance (Web + Mobile) complete
v0.4.0 — Overtime + Admin Dashboard + Export complete
v1.0.0 — UAT passed, deployed to company server
```

---

## 13. Deliverables (End of Internship)

By the end of the ~2-month engagement, the following should be handed over:

1. **Working, deployed application** on the company server:
   - Employee Web app
   - Employee Mobile app (Flutter, at least Android build)
   - Admin Web dashboard
2. **Source code** in the monorepo, tagged `v1.0.0`, with clean commit history.
3. **Documentation package**:
   - PRD v1.0
   - ERD
   - API Documentation
   - Architecture Diagram
   - User Flow Documentation
   - Wireframes
   - Meeting Notes (full sprint history)
   - Deployment Guide
   - README
   - Testing Report
   - User Manual (Employee + Admin)
4. **Project management artifacts** (this package): WBS, Roadmap, Sprint history, Timeline, Milestones, Task Breakdown, RACI, Risk Register, Definition of Done, Trello board (archived state).
5. **Trained Admin/HRD user(s)** — a short walkthrough session covering Employee Management, Project Assignment, Dashboard, and Export.
6. **PKL closing report** (individual, per team member) summarizing contributions and learnings.

---

*This package is designed to be handed directly to the mentor as evidence of professional project management practice, and to the engineering team as an immediately actionable execution plan — every card in Section 10 is ready to paste into Trello without further rewriting.*
