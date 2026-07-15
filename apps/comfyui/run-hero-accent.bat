@echo off
setlocal
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set PYTHONNOUSERSITE=1
"C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe" "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\scripts\run-img2img.py" --workflow "hero-accent-v3-img2img.json" --seed 12001 --input-image "hero-accent-input-rgb.png"
