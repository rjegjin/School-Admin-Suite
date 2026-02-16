# Development Log

## [2026-02-04] Project Initialization
-   **Action:** Initialized Git repository and set up project structure.
-   **Files Created:**
    -   `.gitignore`: Added exclusions for secrets (`service_key.json`) and system files.
    -   `README.md`: Documented project overview and structure.
    -   `gemini.md`: Established AI context and guidelines.
    -   `dev_log.md`: Started development log.
-   **Status:** Successfully pushed to `https://github.com/rjegjin/Project_Utilities_Event`.
-   **Next Steps:**
    -   Review existing scripts for dependencies.

## [2026-02-04] Added Seat Architect UI (React)
-   **Action:** Saved a React-based seat randomization interface.
-   **Files Created:**
    -   `seat_randomizer_web/App.jsx`: Main React component with advanced randomization logic.
-   **Details:** 
    -   Features: Gender-pair matching, forbidden group adjacency checks, and a modern Tailwind CSS UI.
    -   Algorithm: Includes an iterative validation loop (max 2000 attempts) to satisfy constraints.

## [2026-02-04] Added Class Configuration Data
-   **Action:** Saved 3rd Grade Class 3 student data and seating constraints.
-   **Files Created:**
    -   `seat_randomizer/class_config.js`: Contains `CLASS_CONFIG` with student names, genders, and `forbiddenGroups`.
-   **Details:** 
    -   Added CommonJS export for potential Node.js integration.
    -   Includes gender data and specific forbidden pairings for the seating algorithm.

## [2026-02-04] Added Seat Randomizer Utility
-   **Action:** Created a new utility for randomizing student seats and uploading to Google Sheets.
-   **Files Created:**
    -   `seat_randomizer/seat_manager.py`: Main script for seat randomization and GSheet integration.
    -   `seat_randomizer/requirements.txt`: Dependency list (gspread, google-auth).
-   **Details:** 
    -   Implements Fisher-Yates shuffle via `random.sample`.
    -   Supports 5-column grid layout for seat arrangement.
    -   Configured to use `service_key.json`.

## [2026-02-04] Security Update
-   **Action:** Removed sensitive image files in `3-3 Highlight/` from version control.
-   **Details:** 
    -   Updated `.gitignore` to exclude `*.jpg` and `*.png` in `3-3 Highlight/`.
    -   Executed `git rm --cached` to stop tracking existing images without deleting local copies.
