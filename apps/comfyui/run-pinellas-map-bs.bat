@echo off
setlocal
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set PYTHONNOUSERSITE=1
set EXE="C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe"
set WF="C:\Users\camer\DEVNEW\GRASS\apps\comfyui\workflows\pinellas-map-v3-img2img.json"
set SCRIPT="C:\Users\camer\DEVNEW\GRASS\apps\comfyui\scripts\run-img2img.py"
set IN="C:\Users\camer\DEVNEW\GRASS\apps\comfyui\outputs\grass-input\pinellas-map-input-rgb.png"

%EXE% %SCRIPT% --workflow %WF% --seed 9002 --input-image %IN%
%EXE% %SCRIPT% --workflow %WF% --seed 9003 --input-image %IN%
%EXE% %SCRIPT% --workflow %WF% --seed 9004 --input-image %IN%
