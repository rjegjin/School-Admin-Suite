# Gemini Context & Guidelines

## Project Overview
This project, `Project_Utilities_Event`, is a collection of utility scripts (Python/PowerShell) and HTML interfaces designed for event management and file organization tasks.

## Key Components
1.  **3-3 Highlight:** Web interface for image display.
2.  **File Tools:** Python/PS1 scripts for automation (Excel merging, file organizing).
3.  **Lottery Event:** Simple HTML/CSV based lucky draw system.

## Development Conventions
-   **Python Environment:** Always use root `unified_venv` at `/home/rjegj/projects/unified_venv`. Do not create local venvs.
-   **Documentation:** Maintain `dev_log.md` for all significant changes.
-   **Safety:** 
    -   NEVER commit `service_key.json` or other secrets.
    -   Verify file paths before running deletion or move scripts.
-   **Style:** Follow existing coding patterns in `.py` and `.html` files.

## Workflow
1.  Read `dev_log.md` to understand recent changes.
2.  Update `dev_log.md` with new entries upon completing tasks.
3.  Ensure cross-platform compatibility where possible, but note that `.ps1` scripts are Windows-specific.
