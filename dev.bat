@echo off
REM Use this instead of "npm run dev" to avoid PowerShell stderr-exit issues
node --max-old-space-size=4096 node_modules\next\dist\bin\next dev -p 4000 --webpack
