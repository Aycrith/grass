@echo off
setlocal
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set PYTHONNOUSERSITE=1
"C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe" "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\scripts\run-img2img.py" --workflow "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\workflows\pinellas-map-v3-img2img.json" --seed 9001 --input-image "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\outputs\grass-input\pinellas-map-input-rgb.png"
