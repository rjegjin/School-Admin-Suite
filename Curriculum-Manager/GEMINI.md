# GEMINI.md - Science Hours Allocation System Context

## 1. Project Overview
- **Project:** 2026학년도 과학과 시수 배정 시스템 (Science Hours Allocation System)
- **Goal:** Automate the creation and visualization of teacher schedules for the science department, mimicking the official approval document layout.
- **Location:** `web_tools/science_hours_system/`
- **Tech Stack:** React (CDN-based), Tailwind CSS, Lucide Icons. (No build step required)

## 2. Key Components
- **`App.js`:** Single-file React component containing all logic, data, and UI.
- **`index.html`:** Entry point loading React, Babel, and Tailwind from CDN.
- **Data Structure:** `teachers` array containing `schedules` with `grade`, `start` (class), `end` (class), and `text` (hours).

## 3. Visualization Rules (Digital Scan View)
- **Grid System:** 
  - 1st Grade: 14 classes (2+1 units)
  - 2nd Grade: 15 classes (4 units)
  - 3rd Grade: 14 classes (4 units)
- **Schedule Blocks:**
  - Represented by colored blocks (`div`) positioned absolutely within the grid.
  - **Width:** Percentage based on class range (`end - start + 1`).
  - **Text:** Must show "{Subject} ({Total Hours})" (e.g., "Science A (18)").
  - **Overlap:** Use `offsetY` to stack overlapping schedules (e.g., Cho Gyu-sang).
- **Colors:**
  - Science A: Blue (`bg-blue-100`)
  - Science B: Indigo (`bg-indigo-100`)
  - Topic Selection: Green (`bg-green-100`)
  - Creative Activity (Cr): Orange (`bg-orange-100`)

## 4. Memory & Workflow
- **Python Environment:** Always use root `unified_venv` at `/home/rjegj/projects/unified_venv` for any backend or automation tasks.
- **Code-First:** Always check `App.js` state before modifying data.
- **Visual Fidelity:** Ensure the "Preview" tab matches the provided scanned document structure exactly (approvals, header, footer).
- **Dual View:** Maintain both the "Preview" (Document) and "Data" (Dashboard) tabs.
