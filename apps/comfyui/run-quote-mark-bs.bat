@echo off
setlocal enabledelayedexpansion
for %%s in (7002 7003 7004) do (
  echo === seed %%s ===
  "C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe" "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\scripts\run-img2img.py" --workflow "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\workflows\quote-mark-v3-img2img.json" --seed %%s --input-image "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\outputs\grass-input\quote-mark-input-rgb.png"
)
