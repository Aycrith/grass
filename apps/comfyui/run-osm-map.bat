@echo off
REM D-0025: Render OSM-based Pinellas line-art map.
REM Uses system Python 3.13 (the embedded ComfyUI Python
REM doesn't have shapely in its own site-packages).
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
"C:\Program Files\Python313\python.exe" "C:\Users\camer\DEVNEW\GRASS\apps\comfyui\scripts\make-osm-pinellas-map.py"
