#!/usr/bin/env python3
"""
tmp/qa-pick.py -- visual QA-pick analysis runner.

Walks 7 duplicate hero-asset MP4s at C:\\Users\\camer\\Downloads\\, extracts
3 sample frames per video (t=0.5s, t=duration/2, t=duration-0.5s), and
computes proxy metrics for the visual-QA pick:

  - file size + ffprobe metadata (duration, nb_frames, bit_rate, codec,
    width, height, fps, pix_fmt)
  - loop_seamlessness proxy: per-pixel mean absolute diff between first
    (t=0.5s) and last (t=duration-0.5s) frames at 320x180 downscale;
    lower is cleaner loop.
  - green_channel_mean: green-channel mean luma at each of 3 frames;
    brand greens fall in roughly Y=50-150.

Outputs:
  - stdout: human-readable text report, parseable verbatim
  - apps/web/visual/inventory/frames/qa-pick-metrics.json: machine-readable

Frames written to apps/web/visual/inventory/frames/<concept>__<basename>__<label>.png.

Replaces the bash wrapper tmp/qa-pick-basher.sh (which referenced a
helper file that did not exist).
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError


# 7 duplicates: (key, concept, glob pattern seeking the actual filename
# in C:\\Users\\camer\\Downloads\\)
DUPLICATES: tuple[tuple[str, str, str], ...] = (
    ("egret_1",   "egret",   "Egret*202607172016_202607172038.mp4"),
    ("egret_2",   "egret",   "Egret*202607172016.mp4"),
    ("mower_7",   "mower",   "Riding_mower*202607171603.mp4"),
    ("mower_8",   "mower",   "Riding_mower*202607171601.mp4"),
    ("gouache_9",  "gouache", "Hand-painted_gouache*illustratio*202607171636.mp4"),
    ("gouache_10", "gouache", "Hand-painted_gouache*painting_still*202607171732.mp4"),
    ("gouache_11", "gouache", "Hand-painted_gouache*storybook*202607171737.mp4"),
)


# --- Per-step + script-wide timeout budget (Q7 from prior code-review).
# Original was 30s on ffprobe + 30s on each of 3 ffmpeg invocations per
# video = worst-case 14 minutes across 7 videos. Tightened to keep
# total runtime bounded; the metrics produced are still deterministic
# for the same input MP4 bytes. ---
FFPROBE_TIMEOUT_S = 10
FFMPEG_TIMEOUT_S = 15
SCRIPT_DEADLINE_S = 90.0


def ffprobe_json(path: Path) -> dict:
    """Run ffprobe on a video file; return parsed JSON dict.

    Errors return dict {'error': str} -- never raise from tooling
    failures; let the caller decide how to surface.
    """
    cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_format", "-show_streams",
        str(path),
    ]
    try:
        out = subprocess.run(
            cmd, capture_output=True, text=True, timeout=FFPROBE_TIMEOUT_S, check=False
        )
        if out.returncode != 0:
            return {"error": f"ffprobe rc={out.returncode}: {out.stderr[:200]}"}
        return json.loads(out.stdout)
    except FileNotFoundError:
        return {"error": "ffprobe not on PATH"}
    except Exception as e:  # parse error, timeout, etc.
        return {"error": str(e)}


def extract_frame(video: Path, ts: float, out: Path) -> bool:
    """Extract one frame from <video> at <ts> seconds to <out> PNG.

    Returns True on success. Silently succeeds when out already exists;
    ffmpeg -y overwrites.
    """
    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", f"{ts:.3f}",
        "-i", str(video),
        "-frames:v", "1",
        str(out),
    ]
    try:
        cp = subprocess.run(cmd, capture_output=True, timeout=FFMPEG_TIMEOUT_S, check=False)
        return cp.returncode == 0 and out.exists() and out.stat().st_size > 0
    except Exception:
        return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--downloads", default="/c/Users/camer/Downloads",
        help="path to user's Downloads dir",
    )
    ap.add_argument(
        "--frames-out",
        default="/c/Users/camer/DEVNEW/grass/apps/web/visual/inventory/frames",
        help="where extracted frames go",
    )
    args = ap.parse_args()

    dl = Path(args.downloads)
    frames = Path(args.frames_out)
    frames.mkdir(parents=True, exist_ok=True)

    ffmpeg_bin = shutil.which("ffmpeg")
    ffprobe_bin = shutil.which("ffprobe")

    print(f"=== TOOLING ===")
    print(f"  ffmpeg  = {ffmpeg_bin}")
    print(f"  ffprobe = {ffprobe_bin}")
    print(f"  numpy   = {np.__version__}")
    print(f"  PIL     = {Image.__version__}")
    print(f"  downloads  = {dl}")
    print(f"  frames_out = {frames}")
    print()
    if not ffmpeg_bin or not ffprobe_bin:
        print("ERROR: ffmpeg/ffprobe not on PATH; aborting")
        return 2

    results: list[dict] = []
    _start = time.monotonic()
    for key, concept, pattern in DUPLICATES:
        # Q7: script-wide deadline guard. Abort remaining videos if
        # the 90s cumulative budget is exhausted; emit the partial-
        # results JSON before exit so downstream code can read what
        # we did process. The cap is a ceiling on STEALTHY long tails
        # from disk-I/O stalls, not a guarantee that an in-flight
        # subprocess is killed (subprocesses use their own timeout).
        if time.monotonic() - _start > SCRIPT_DEADLINE_S:
            print(
                f"    SCRIPT_DEADLINE {SCRIPT_DEADLINE_S}s exceeded after "
                f"{time.monotonic() - _start:.1f}s; aborting remaining videos"
            )
            break
        matches = sorted(dl.glob(pattern))
        print(f"### {key} ({concept}) :: glob '{pattern}'")
        if not matches:
            print(f"    STATUS: MISSING (no glob match in {dl})")
            continue
        if len(matches) > 1:
            print(f"    NOTE: {len(matches)} matches; using first")
        video = matches[0]
        size = video.stat().st_size
        meta = ffprobe_json(video)
        fmt = meta.get("format", {})
        streams = meta.get("streams", [])
        v_stream = next(
            (s for s in streams if s.get("codec_type") == "video"), {}
        )
        try:
            duration = float(fmt.get("duration", "8.0"))
        except (TypeError, ValueError):
            duration = 8.0
        bit_rate = fmt.get("bit_rate", "?")
        nb_frames = v_stream.get("nb_frames", "?")
        codec = v_stream.get("codec_name", "?")
        width = v_stream.get("width", "?")
        height = v_stream.get("height", "?")
        fps = v_stream.get("r_frame_rate", "?")
        pix_fmt = v_stream.get("pix_fmt", "?")

        out_base = frames / f"{concept}__{video.stem}"
        frame_t05_p = out_base.with_name(out_base.name + "__t0_5s.png")
        frame_tmid_p = out_base.with_name(out_base.name + "__tmid.png")
        frame_tend_p = out_base.with_name(out_base.name + "__tend.png")

        extract_frame(video, 0.5, frame_t05_p)
        extract_frame(video, duration / 2.0, frame_tmid_p)
        extract_frame(video, max(0.0, duration - 0.5), frame_tend_p)

        def safe_open_summarize(p: Path):
            # Q3: wrap Image.open in try/except; a truncated or non-image
            # file passes the stat()-size check but raises from PIL
            # mid-loop. Returning (None, None) lets the caller skip
            # cleanly instead of crashing the whole script.
            if not p.exists() or p.stat().st_size == 0:
                return None, None
            try:
                im = Image.open(p).convert("RGB").resize((320, 180))
            except (UnidentifiedImageError, OSError, ValueError, IndexError) as e:
                # Q3 polish: route diagnostic WARN to stderr so the
                # data stream (stdout) stays clean for downstream parsers.
                print(
                    f"    WARN: {p.name} unreadable "
                    f"({type(e).__name__}): {e}",
                    file=sys.stderr,
                )
                return None, None
            arr = np.asarray(im, dtype=np.int32)
            green_mean = int(arr[:, :, 1].mean())
            return im, green_mean

        first_im, first_green = safe_open_summarize(frame_t05_p)
        last_im, last_green = safe_open_summarize(frame_tend_p)
        _, mid_green = safe_open_summarize(frame_tmid_p)

        if first_im is not None and last_im is not None:
            a = np.asarray(first_im, dtype=np.int32)
            b = np.asarray(last_im, dtype=np.int32)
            diff = np.abs(a - b)
            mean_diff = float(diff.mean())
            max_diff = int(diff.max())
        else:
            mean_diff = None
            max_diff = None

        record = {
            "key": key,
            "concept": concept,
            "path": str(video),
            "size_bytes": size,
            "duration_s": duration,
            "bit_rate": bit_rate,
            "nb_frames": nb_frames,
            "codec": codec,
            "width": width,
            "height": height,
            "fps": fps,
            "pix_fmt": pix_fmt,
            "loop_seamlessness_mean_diff_RGB": mean_diff,
            "loop_seamlessness_max_diff": max_diff,
            "green_channel_mean": {
                "t0_5s": first_green, "tmid": mid_green, "tend": last_green,
            },
            "frame_paths": {
                "t0_5s": str(frame_t05_p),
                "tmid": str(frame_tmid_p),
                "tend": str(frame_tend_p),
            },
        }
        results.append(record)

        print(f"    video = {video.name}")
        print(f"    size_bytes = {size}")
        print(f"    duration_s = {duration:.3f}")
        print(f"    nb_frames  = {nb_frames}")
        print(f"    codec = {codec}  {width}x{height}@{fps}  pix_fmt={pix_fmt}")
        print(f"    bit_rate = {bit_rate}")
        print(f"    loop_seamlessness_mean_diff_first_vs_last = {mean_diff}")
        print(f"    loop_seamlessness_max_diff = {max_diff}")
        print(
            f"    green_channel_mean: t0_5s={first_green} "
            f"tmid={mid_green} tend={last_green}  (brand greens target ~50-150)"
        )
        print(f"    frame_paths:")
        for label, p in record["frame_paths"].items():
            sz = Path(p).stat().st_size if Path(p).exists() else 0
            print(f"      {label}: {p} ({sz} B)")
        print()

    print(f"=== TOTAL ===")
    total_bytes = sum(r["size_bytes"] for r in results)
    total_mib = total_bytes / 1024 / 1024
    print(f"    {len(results)} videos, {total_bytes} bytes ({total_mib:.2f} MiB) total")

    json_path = frames / "qa-pick-metrics.json"
    json_path.write_text(
        json.dumps(results, indent=2, default=str), encoding="utf-8"
    )
    print(f"    metrics JSON written to: {json_path}")
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
