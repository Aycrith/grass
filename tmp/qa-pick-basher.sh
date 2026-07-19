#!/usr/bin/env bash
# qa-pick-basher.sh -- Extract 3 sample frames per duplicate + compute
# metrics for the visual-QA pick among re-rolled hero asset MP4s.
#
# Per video, produces:
#   - file size (bytes) + mtime
#   - ffprobe metadata (duration / nb_frames / bitrate / codec / fps / pix_fmt)
#   - 3 frame samples extracted via ffmpeg (t0.5s, tmid=dur/2, tend=dur-0.5s)
#   - loop_seamlessness proxy: mean per-pixel diff RGB between first and last
#   - green_channel_mean proxy: green-channel mean luma at t0.5s, tmid, tend
#
# Output is plain text, parseable via stdout verbatim.
# Frames are written to apps/web/visual/inventory/frames/.

set +e

DL='/c/Users/camer/Downloads'
[ -d "$DL" ] || DL='C:/Users/camer/Downloads'
INV='/c/Users/camer/DEVNEW/grass/apps/web/visual/inventory'
FRAMES="$INV/frames"
mkdir -p "$FRAMES"

echo '===================================================================='
echo '  QA-PICK BASHER -- tools + per-duplicate metrics'
echo '===================================================================='
echo "  downloads:  $DL"
echo "  frames out: $FRAMES"
echo ''

echo '=== TOOLING ==='
which ffmpeg 2>&1 | sed 's/^/  ffmpeg = /'
which ffprobe 2>&1 | sed 's/^/  ffprobe = /'
ffmpeg -version 2>&1 | head -1 | sed 's/^/  /'
ffprobe -version 2>&1 | head -1 | sed 's/^/  /'
python -c "from PIL import Image; print(f'  PIL: {Image.__version__}')" 2>&1 | sed 's/^/  /'
echo ''

for entry in \
    "egret_1:$DL/Egret_standing_in_shallow_water_202607172016_202607172038.mp4" \
    "egret_2:$DL/Egret_standing_in_shallow_water_202607172016.mp4" \
    "mower_7:$DL/Riding_mower_cutting_lawn_202607171603.mp4" \
    "mower_8:$DL/Riding_mower_cutting_lawn_202607171601.mp4" \
    "gouache_9:$DL/Hand-painted_gouache_illustratio…_202607171636.mp4" \
    "gouache_10:$DL/Hand_painted_gouache_painting_still_202607171732.mp4" \
    "gouache_11:$DL/Hand-painted_gouache_storybook_p…_202607171737.mp4"; do

  key="${entry%%:*}"
  f="${entry#*:}"

  # concept label derived from key prefix
  case "$key" in
    egret_*)  concept="egret" ;;
    mower_*)  concept="mower" ;;
    gouache_*) concept="gouache" ;;
  esac

  echo ''
  echo "### $key ($concept)"
  echo "    path: $f"
  if [ ! -f "$f" ]; then
    echo '    STATUS: MISSING'
    continue
  fi

  SIZE=$(stat -c %s "$f" 2>/dev/null || ls -la "$f" | awk '{print $5}')
  echo "    size_bytes=$SIZE"

  echo '    ffprobe:'
  ffprobe -v quiet -show_entries format=duration,bit_rate,size:stream=codec_name,width,height,pix_fmt,nb_frames,r_frame_rate -of default=noprint_wrappers=1 "$f" 2>&1 | sed 's/^/      /'

  out_base="$FRAMES/${concept}__$(basename "$f" .mp4)"

  # Extract 3 sample frames (t0.5s, tmid=dur/2, tend=dur-0.5s)
  python "$INV/_qa_pick_helper.py" --video "$f" --out-base "$out_base"

  echo ''
done

echo ''
echo '===================================================================='
echo '  listing of generated frame PNGs (sizes)'
echo '===================================================================='
ls -la "$FRAMES"/*.png 2>/dev/null | awk '{printf "  %s bytes  %s\n",$5,$NF}'
echo ''
echo 'DONE'
