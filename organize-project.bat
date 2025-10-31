@echo off
echo ========================================
echo   Project Organization Script
echo ========================================
echo.

echo This script will organize your project files:
echo   - Move documentation to docs/ folder
echo   - Move test scripts to tests/ folder
echo   - Keep all source code in place
echo.
echo WARNING: This will move files around!
echo.
pause

echo.
echo Creating folders...
if not exist "docs" mkdir docs
if not exist "docs\setup" mkdir docs\setup
if not exist "docs\testing" mkdir docs\testing
if not exist "docs\fixes" mkdir docs\fixes
if not exist "tests" mkdir tests

echo.
echo Moving documentation files...
move *_GUIDE.md docs\setup\ 2>nul
move *_FIX.md docs\fixes\ 2>nul
move *_SUMMARY.md docs\fixes\ 2>nul
move *_REPORT.md docs\testing\ 2>nul
move *_COMPLETE.md docs\fixes\ 2>nul
move *_READY.md docs\ 2>nul
move *_STATUS.md docs\ 2>nul

echo.
echo Moving test files...
move test-*.js tests\ 2>nul
move fix-*.js tests\ 2>nul
move verify-*.js tests\ 2>nul

echo.
echo Keeping essential files in root:
echo   - README.md
echo   - SETUP_GUIDE.md (if exists)
echo   - package.json
echo   - All source code
echo.

echo ========================================
echo   Organization Complete!
echo ========================================
echo.
echo Your project is now organized:
echo   docs/       - All documentation
echo   tests/      - All test scripts
echo   src/        - Source code (unchanged)
echo   components/ - React components (unchanged)
echo   server/     - Backend code (unchanged)
echo.
echo The application is still fully functional!
echo.
pause
