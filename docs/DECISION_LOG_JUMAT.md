# 📝 Requirement Validation & Decision Log (v0.2 Review)

**Project:** SUCOFINDO Attendance Management System  
**Meeting:** Requirement Finalization (v0.2 → v1.0)  
**Date:** Friday, 31 July 2026  
**Participants:** Mentor, HRD, IT Team, Internship Team

---

# 📌 Meeting Objectives

This meeting aims to finalize all pending requirements before development begins.

Target output:

- ✅ Final Project Scope
- ✅ Final Business Rules
- ✅ Final Technical Decisions
- ✅ Final Dashboard Requirements
- ✅ Final Reporting Format
- ✅ Remaining Open Issues

---

# 1️⃣ Feature Scope Validation

## Authentication

### Forgot Password

- [ ] IN-SCOPE
- [ ] OUT-OF-SCOPE (Password reset handled manually by Admin)

Notes

---

### Employee Registration

Current Proposal

- No public registration
- Accounts are generated/imported from company database
- Login credentials are distributed to registered employees

Decision

- [ ] Approved
- [ ] Revised

Notes

---

### First Login

- [ ] User must change password
- [ ] User may keep temporary password

Notes

---

# Employee Management

### CRUD Employee

- [ ] IN-SCOPE
- [ ] OUT-OF-SCOPE

If OUT-OF-SCOPE

Data only comes from Headquarters database.

Notes

---

# QR Attendance

- [ ] IN-SCOPE
- [ ] OUT-OF-SCOPE

Notes

---

# Holiday Calendar

- [ ] IN-SCOPE
- [ ] OUT-OF-SCOPE

Notes

---

# Notification

Notification Type

- [ ] Dashboard Notification
- [ ] Email Notification
- [ ] Push Notification

Notes

---

# Audit Log

Track user activities

- Login
- Attendance
- Overtime
- Data Changes

Decision

- [ ] IN-SCOPE
- [ ] OUT-OF-SCOPE

---

# 2️⃣ Attendance Business Rules

## Working Hours

Working hours are flexible.

Attendance is never rejected because of late check-in.

Question

What time should trigger a warning?

- [ ] 08:00 WIB
- [ ] Other: __________

Warning Type

- [ ] Badge
- [ ] Red text
- [ ] Dashboard warning
- [ ] Other

Notes

---

## Attendance Method

Employee can check in using

- [ ] Mobile
- [ ] Web
- [ ] Both

Notes

---

## WFO / WFA

Attendance requires employee to select

- [ ] WFO
- [ ] WFA

Need additional validation?

- [ ] Yes
- [ ] No

If Yes

______________________

---

## GPS Policy

### Mobile

GPS

- [ ] Required
- [ ] Optional

---

### Web

How should location work?

- [ ] Browser Geolocation
- [ ] Office Network Only
- [ ] No GPS Required
- [ ] Other

Notes

---

## Photo Policy

Check In

- [ ] Photo Required
- [ ] Not Required

Check Out

- [ ] Photo Required
- [ ] Not Required

Overtime

- [ ] Photo Required
- [ ] Not Required

Photo Storage

- [ ] Original
- [ ] Compressed
- [ ] Resize Before Upload

Retention Period

_____________________

---

# 3️⃣ Overtime Module

Purpose

Manual overtime recording for HR monitoring.

---

Employee Input

- Date
- Duration
- Start Time
- End Time
- Description

Approved?

- [ ] Yes
- [ ] Revised

---

Need GPS?

- [ ] Yes
- [ ] No

Need Photo?

- [ ] Yes
- [ ] No

Need HR Approval?

- [ ] Yes
- [ ] No

Backdate Allowed?

- [ ] Yes
- [ ] No

Maximum Backdate

________ days

Maximum Overtime

- ______ Hours / Day
- ______ Hours / Week
- ______ Hours / Month

Alert Threshold

____________________

Notes

---

# 4️⃣ Admin Dashboard

Please select dashboard widgets.

Summary Cards

- [ ] Total Employees
- [ ] Present Today
- [ ] WFO
- [ ] WFA
- [ ] Late
- [ ] Overtime Today

Charts

- [ ] Monthly Attendance
- [ ] Weekly Attendance
- [ ] Attendance Trend
- [ ] Overtime Trend

Tables

- [ ] Recent Attendance
- [ ] Employees Not Checked Out
- [ ] Late Employees
- [ ] Overtime Alerts

Additional Widgets

________________________________

---

# 5️⃣ Export Report

Export Format

- [ ] CSV
- [ ] Excel

Report Type

- [ ] Monthly
- [ ] Weekly
- [ ] Daily

Columns

- [x] Employee Name
- [x] Employee ID / NIP
- [x] Department
- [x] Date
- [x] Check In
- [x] Check Out
- [x] Attendance Status
- [x] WFO / WFA
- [x] GPS Coordinate
- [x] Daily Work Summary
- [x] Overtime Duration
- [x] Overtime Description

Additional Columns

______________________________

Should photos be exported?

- [ ] Yes
- [ ] No

---

# 6️⃣ Database & Integration

Headquarters Database

Clone Type

- [ ] One-time Migration
- [ ] Scheduled Synchronization

Synchronization

- [ ] Daily
- [ ] Weekly
- [ ] Monthly

Tables to Clone

- [ ] Employee
- [ ] Department
- [ ] Position
- [ ] User
- [ ] Attendance History
- [ ] Other

Can local database schema be modified?

- [ ] Yes
- [ ] No

Can we add new tables?

- [ ] Yes
- [ ] No

PIC

______________________

---

# 7️⃣ Infrastructure

Development

- [ ] Local Development

Deployment

- [ ] Internal Server
- [ ] Cloud
- [ ] VPS
- [ ] Other

Database

- [ ] MySQL
- [ ] PostgreSQL
- [ ] SQL Server
- [ ] Other

---

# 8️⃣ Security Decisions

Password

- [ ] Laravel Hash
- [ ] Other

Role Based Access

- [ ] Employee
- [ ] Admin
- [ ] HR

Session Timeout

_________________

Login Attempts

- [ ] Unlimited
- [ ] Limited

HTTPS Required

- [ ] Yes
- [ ] No

---

# 9️⃣ Open Questions

- __________________________________________

- __________________________________________

- __________________________________________

---

# 🔟 Parking Lot (Future Features)

Features discussed but intentionally excluded from MVP.

- [ ] Face Recognition
- [ ] QR Attendance
- [ ] Leave Request
- [ ] Permission Workflow
- [ ] Push Notification
- [ ] Holiday Calendar
- [ ] Advanced Analytics
- [ ] Approval Workflow
- [ ] Other

---

# ✅ Meeting Summary

Requirements Approved

_____________________________________

Requirements Revised

_____________________________________

Requirements Deferred

_____________________________________

Action Items

| Task | PIC | Due Date |
|------|-----|----------|
| | | |
| | | |
| | | |

---

## Final Decision

Requirement Status

- [ ] Approved for Development
- [ ] Requires Revision
- [ ] Pending Additional Discussion

Mentor Signature

_________________________

HRD Signature

_________________________

Project Team

_________________________
