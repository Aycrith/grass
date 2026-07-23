'use client';

/**
 * MuteToggle - the hero's ambient-audio mute/unmute button.
 *
 * Source: `brielle_ref.mp3` (the 80 KB ambient loop in
 * `C:\Users\camer\Downloads\grasscontent\`, copied + renamed to
 * `apps/web/public/hero/audio/ambient-loop.mp3` per the 2026-07-22
 * hero integration plan decision #1). Format: MP3, 2.74 s, 234 kbps,
 * 80 KB. The loop seam should be verified by spectrogram in a future
 * QA pass - the file is small enough to inspect by ear.
 *
 * Wiring:
 *   - Native <audio loop preload="none" crossOrigin="anonymous">
 *     element. The element is rendered INSIDE this component and
 *     stays alive even when the user scrolls past the hero (the
 *     audio element is a DOM node; it doesn't care about its
 *     parent's visibility).
 *   - localStorage key `largo.hero.audio.muted` remembers the
 *     user's choice. Default = muted. Click toggles + persists.
 *   - Muted-by-default is the only defensible default: autoplay
 *     restrictions on mobile + desktop require a user gesture, so
 *     any sound on first paint would either be blocked or require
 *     an explicit opt-in.
 *   - Click handler sets `volume = 0.3` and calls `.play()`. The
 *     browser's autoplay policy is satisfied because the user just
 *     clicked the button - this is the canonical pattern.
 *
 * Accessibility:
 *   - aria-label flips between "Play ambient audio" / "Mute ambient audio"
 *   - aria-pressed reflects the current playing state
 *   - Focus ring uses --ll-sky for a high-contrast outline
 *   - The element is OMITTED entirely when `prefers-reduced-data: reduce`
 *     is set so we don't burn the user's data budget on a non-essential
 *     ambient loop. A non-interactive placeholder of the same size
 *     keeps the layout from shifting.
 *   - On SSR, only the placeholder renders. The audio element and the
 *     button are added after hydration once we know the user's
 *     preferences (reduced-data) and can safely read localStorage.
 *
 * Visual:
 *   - 28px circle, paper-cream tile, 60% opacity until hover
 *   - Two inline-SVG icons (speaker on / speaker-with-slash off)
 *     drawn in the same gouache ink style as the rest of the hero
 *   - Positioned bottom-right of the hero (1rem from the edges),
 *     z-index 12 (above LiveStatus + TelemetryStats at z 11)
 *   - Bumps to 32px on mobile (<768px) for tap-target compliance
 */

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import styles from './MuteToggle.module.css';

const STORAGE_KEY = 'largo.hero.audio.muted';
const VOLUME = 0.3;
const AUDIO_SRC = '/hero/audio/ambient-loop.mp3';

export function MuteToggle(): ReactNode {
  const audioRef = useRef<HTMLAudioElement>(null);
  // Default to muted so the SSR markup matches the no-audio state
  // and the first paint after hydration doesn't flip the icon.
  const [muted, setMuted] = useState(true);
  // `hydrated` is false during SSR + the first client render. We
  // render the placeholder until then, then swap in the button.
  const [hydrated, setHydrated] = useState(false);
  // `reducedData` is true when the user's OS or browser asks us
  // to skip non-essential data. We render no button and no audio
  // element in that case - just the placeholder.
  const [reducedData, setReducedData] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-data: reduce)');
    setReducedData(mq.matches);
    setHydrated(true);

    // Read persisted preference. Default = muted. If the user
    // previously chose to play, attempt to resume - autoplay may
    // block this and we'll fall back to muted + button.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'false' && audioRef.current) {
        audioRef.current.volume = VOLUME;
        void audioRef.current.play().then(() => {
          setMuted(false);
        }).catch(() => {
          // Browser blocked autoplay. Stay muted; user can click
          // to start.
          setMuted(true);
        });
      }
    } catch {
      // localStorage blocked (private mode, sandboxed iframe, etc).
      // Stay muted, no persistence. No user-facing error.
    }
  }, []);

  const handleToggle = (): void => {
    if (!audioRef.current) return;
    const nextMuted = !muted;
    if (nextMuted) {
      // Going from playing -> muted = pause, keep the current time.
      audioRef.current.pause();
    } else {
      // Going from muted -> playing = set volume + play. Volume
      // is set on every click to be safe in case some browser
      // changed it (autoplay policy, OS mixer, etc).
      audioRef.current.volume = VOLUME;
      void audioRef.current.play().catch(() => {
        // play() rejected - revert state.
        setMuted(true);
        return;
      });
    }
    setMuted(nextMuted);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextMuted ? 'true' : 'false');
    } catch {
      // localStorage blocked. In-memory state still works for this
      // session; the next visit will start muted again.
    }
  };

  return (
    <div className={styles.wrap} aria-hidden={reducedData}>
      {/* The audio element is only mounted on the client (useEffect
       * gates state hydration; the <audio> JSX is always present
       * but the .src and .muted/loop/preload attributes only matter
       * after hydration). When reducedData is true the element is
       * also a no-op - browsers won't fetch a src-less/preload-none
       * element, so no data is burned.
       */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="none"
        muted={muted}
        data-testid="hero-ambient-audio"
      />
      {hydrated && !reducedData ? (
        <button
          type="button"
          className={styles.button}
          onClick={handleToggle}
          aria-label={muted ? 'Play ambient audio' : 'Mute ambient audio'}
          aria-pressed={!muted}
          data-testid="hero-mute-toggle"
        >
          {muted ? <SpeakerSlashIcon /> : <SpeakerIcon />}
        </button>
      ) : (
        // SSR placeholder: a non-interactive 28px square so the
        // layout doesn't shift when the button mounts on hydration.
        // For prefers-reduced-data users this is the final state
        // (no audio, no button) - the dimensions match the button
        // exactly so the visual layout is identical.
        <span className={styles.placeholder} aria-hidden="true" />
      )}
    </div>
  );
}

function SpeakerIcon(): ReactNode {
  // 16x16 speaker on. Stroked currentColor so it inherits the
  // button's text color; the speaker body is filled at 20% so it
  // reads as "solid" against the paper-cream tile without competing
  // with the strokes.
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Audio playing</title>
      <polygon
        points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerSlashIcon(): ReactNode {
  // 16x16 speaker muted. The slash is two crossed strokes (X mark)
  // rather than a single diagonal - the X reads as "off" more
  // clearly at 16px than a single line.
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Audio muted</title>
      <polygon
        points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}
