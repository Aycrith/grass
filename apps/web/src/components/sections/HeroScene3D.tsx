'use client';

// D-0048 — Wave 4 second pinned scene rebuilt as a 2.5D plane stack.
//
// D-0048 redesign (post first-pass): each plane uses its OWN grasscontent
// texture strip, not the same strip on 3 planes. This gives true parallax
// with each layer doing its own thing:
//   - BG plane  → scene2 (Florida ranch house + palms + sun + mower)
//   - MID plane → palms   (palms framing ranch house, asymmetric)
//   - FG plane  → fern    (close-up fern frond on paper-cream bg)
//
// At any moment the 3 planes show 3 different VEO source compositions at
// 3 different depths. The previous design had all 3 planes cycling through
// the same scene2 strip — that produced a chaotic 3-timestamp mashup
// instead of a layered 2.5D scene.
//
// Architecture (2.5D, not full procedural 3D):
//   - 2D <planeGeometry> wrapped in 3D space at different z depths
//   - Each plane has its own VEO source strip as diffuse texture
//   - Camera orbits on scroll → parallax between planes
//   - Asymmetric framing: BG wide, MID right-offset, FG left-edge grass
//
// Frame cycling: each plane cycles through its strip on a different
// cadence (12s/9s/6s). Even though the VEO mp4s have only 2-3 unique
// frames each (slow hand-painted stillness), the texture swap reads
// as subtle ambient motion.
//
// Accessibility:
//   - prefers-reduced-motion: locks camera orbit, drops wind sway,
//     freezes frame cycling
//   - coarse-pointer (mobile): drops DPR + drops FG plane to save fillrate
//   - WebGL fallback: <picture><img> showing scene2-01.webp when context
//     is unavailable or lost

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import {
  type Mesh,
  type Texture,
  TextureLoader,
} from 'three';

import { MagneticCta, parseScene2Headline } from './HeroFieldTelemetry';

import styles from './HeroScene3D.module.css';

// WebGL availability detection. Probes once on mount; on context loss
// mid-flight we set hasWebGL=false and swap to the static <picture>
// fallback.
function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    const gl =
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      c.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

// Three grasscontent texture strips — one per plane. Each strip is the
// same path-pattern so Phase 1's prep scripts work uniformly. The strips
// were re-extracted by prep-palms-fern-frames.py (palms + ferns) and
// prep-scene2-frames.py (scene2) at 1240×680, paper-cream border cropped.
const SCENE2_TEXTURES = [
  '/hero/layers/v2/scene2-01.webp',
  '/hero/layers/v2/scene2-02.webp',
  '/hero/layers/v2/scene2-03.webp',
  '/hero/layers/v2/scene2-04.webp',
  '/hero/layers/v2/scene2-05.webp',
  '/hero/layers/v2/scene2-06.webp',
] as const;

const PALMS_TEXTURES = [
  '/hero/layers/v2/palms-01.webp',
  '/hero/layers/v2/palms-02.webp',
  '/hero/layers/v2/palms-03.webp',
  '/hero/layers/v2/palms-04.webp',
  '/hero/layers/v2/palms-05.webp',
  '/hero/layers/v2/palms-06.webp',
] as const;

const FERN_TEXTURES = [
  '/hero/layers/v2/fern-01.webp',
  '/hero/layers/v2/fern-02.webp',
  '/hero/layers/v2/fern-03.webp',
  '/hero/layers/v2/fern-04.webp',
  '/hero/layers/v2/fern-05.webp',
  '/hero/layers/v2/fern-06.webp',
] as const;

// Plane positions in 3D space. Sizes tuned to the camera frustum at each
// z depth so planes cover the visible panel + margin for camera orbit.
//
// Camera at z=5 with fov=50 (vertical). At distance d, visible vertical
// extent = 2*d*tan(25°) ≈ 0.933*d. At 16:10 panel aspect, visible
// horizontal ≈ 1.493*d. So:
//   - BG at d=20 → visible 30×20. Plane 32×17 covers with margin.
//   - MID at d=13 → visible 19×12. Plane 22×13 covers with margin.
//   - FG at d=8  → visible 12×7.  Plane 14×8 covers.
//
// Note: panel aspect varies (deep-green scene-1 panel is 4:5, scene-2
// panel can be wider). The 16:10 baseline used here; on narrower panels
// (mobile portrait) the planes are wider than visible so they still cover.
const BG_PLANE = { z: -15, w: 32, h: 17, x: 0, y: 0 } as const;
const MID_PLANE = { z: -8, w: 22, h: 13, x: 5, y: 0.5 } as const;
// FG plane sits at the left edge — fern frame has fronds on the LEFT
// half of the 1240x680 image. Offsetting FG to x=-7 places the fern
// fronds against the left edge of the visible panel; the empty cream
// right half of the texture blends with the page cream backdrop.
const FG_PLANE = { z: -3, w: 14, h: 8, x: -7, y: -2.5 } as const;

// Fog inside Canvas. Cream matches --ll-cream so distant planes fade into
// the page background. Tuned so BG at d=20 sits ~95% into the fog at
// edges, MID at d=13 sits ~50%, FG at d=8 is not fogged.
const FOG_NEAR = 10;
const FOG_FAR = 22;

// Per-plane texture cycling cadence. Different speeds so the texture
// changes don't all hit at once.
const BG_CYCLE_SEC = 12;
const MID_CYCLE_SEC = 9;
const FG_CYCLE_SEC = 6;

interface HeroScene3DProps {
  opacity: MotionValue<number>;
  contentOpacity: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  scene2: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}

export function HeroScene3D({
  opacity,
  contentOpacity,
  scrollProgress,
  scene2,
}: HeroScene3DProps): ReactNode {
  const reduced = useReducedMotion();
  const [isCoarse, setIsCoarse] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
    setHasWebGL(detectWebGL());
  }, []);

  // DPR cap: mobile stays cheap; desktop gets sharper rendering.
  const dprMax = isCoarse ? 1.25 : 1.75;
  // Coarse pointer (mobile / touch) drops the foreground fern plane
  // to save fillrate. The 2 remaining planes (BG scene2 + MID palms)
  // still produce parallax.
  const renderFG = !isCoarse;

  // Camera orbit MotionValue derived from scroll. 0deg at scroll 0,
  // 8deg at scroll 1. Slightly stronger than the previous 6° so the
  // parallax between BG/MID/FG is actually visible.
  const cameraYawDeg = useTransform(scrollProgress, [0, 1], reduced ? [0, 0] : [0, 8]);

  return (
    <motion.div
      className={styles.root}
      style={{ opacity }}
      data-testid="hero-second-scene"
    >
      <div className={styles.canvasWrap} aria-hidden="true">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, dprMax]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;
              canvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                setHasWebGL(false);
              });
            }}
          >
            <Scene2D5
              cameraYawDeg={cameraYawDeg}
              reduced={!!reduced}
              renderFG={renderFG}
            />
          </Canvas>
        ) : (
          <StaticFallback />
        )}
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <motion.div
        className={styles.content}
        style={{ opacity: contentOpacity }}
      >
        <span className={styles.eyebrow}>{scene2.eyebrow}</span>
        <h2 className={styles.headline}>
          <span className={styles.openingMark} aria-hidden="true">
            &ldquo;
          </span>
          {parseScene2Headline(scene2.headline).map((seg, i) =>
            seg.italic ? (
              <em key={`seg-${i}`} className={styles.italic}>
                {seg.text}
              </em>
            ) : (
              <span key={`seg-${i}`}>{seg.text}</span>
            ),
          )}
        </h2>
        <p className={styles.subhead}>{scene2.subhead}</p>
        <div className={styles.actions}>
          <MagneticCta href={scene2.primaryCta.href} variant="sun" size="lg">
            {scene2.primaryCta.label}
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </MagneticCta>
          <MagneticCta href={scene2.secondaryCta.href} variant="ghost" size="lg">
            {scene2.secondaryCta.label}
          </MagneticCta>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
 * StaticFallback — shown when WebGL is unavailable or the
 * context is lost. Renders scene2-01.webp as a static background
 * with the cream scrim overlay. Coherent with scene 1's
 * photographic style and the brand palette.
 * ============================================================ */

function StaticFallback(): ReactNode {
  return (
    <picture className={styles.fallback}>
      <img
        src="/hero/layers/v2/scene2-01.webp"
        alt=""
        className={styles.fallbackImg}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}

/* ============================================================
 * Scene2D5 — the inner Canvas contents.
 *
 * Loads 3 grasscontent texture strips (one per plane) and renders
 * them as 2D planes in real 3D space. Camera orbit driven by
 * scroll progress. Cream-colored fog blends the 3D scene with the
 * page background.
 * ============================================================ */

function Scene2D5({
  cameraYawDeg,
  reduced,
  renderFG,
}: {
  cameraYawDeg: MotionValue<number>;
  reduced: boolean;
  renderFG: boolean;
}): ReactNode {
  // 3 independent texture loads. R3F's useLoader handles Suspense
  // correctly per URL list, so this is the cleanest way to load 3
  // separate strips without splitting on the JS side.
  const scene2Textures = useLoader(TextureLoader, SCENE2_TEXTURES as unknown as string[]);
  const palmsTextures = useLoader(TextureLoader, PALMS_TEXTURES as unknown as string[]);
  const fernTextures = useLoader(TextureLoader, FERN_TEXTURES as unknown as string[]);
  const { camera, scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog('#faf6f0', FOG_NEAR, FOG_FAR);
    // Set the scene background to cream so any pixels not covered by
    // a plane match the page background. Without this, R3F defaults
    // to a black clear color, which shows as a dark vertical column
    // where the BG plane doesn't fully cover (BG plane is sized to
    // the texture's 1.82:1 aspect, which is slightly narrower than
    // the 16:10 panel aspect — leaves a black band at top/bottom).
    scene.background = new THREE.Color('#faf6f0');
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  // Smooth camera yaw toward the scroll-driven target. Mutate
  // camera.rotation.y directly inside useFrame so the rest of the
  // scene sees a stable camera without React re-renders.
  const yawRef = useRef(0);
  const baseCamY = useRef(0);
  useEffect(() => {
    baseCamY.current = camera.position.y;
  }, [camera]);
  useFrame(() => {
    const targetRad = ((cameraYawDeg.get() ?? 0) * Math.PI) / 180;
    const eased = yawRef.current + (targetRad - yawRef.current) * 0.06;
    yawRef.current = eased;
    if (!reduced) {
      camera.rotation.y = eased;
      const t = performance.now() * 0.0001;
      // Camera roll — ~1.1° peak amplitude. Phase 4 tuning.
      camera.rotation.z = Math.sin(t) * 0.02;
      // Y-axis bob — camera drifts ±0.1 units over ~14s period.
      camera.position.y = baseCamY.current + Math.sin(t * 0.45) * 0.1;
    }
  });

  return (
    <>
      <CycledPlane
        textures={scene2Textures}
        z={BG_PLANE.z}
        w={BG_PLANE.w}
        h={BG_PLANE.h}
        x={BG_PLANE.x}
        y={BG_PLANE.y}
        cycleSec={BG_CYCLE_SEC}
        swayDeg={reduced ? 0 : 0.5}
        swayPhase={0}
        cyclePhase={0}
      />
      <CycledPlane
        textures={palmsTextures}
        z={MID_PLANE.z}
        w={MID_PLANE.w}
        h={MID_PLANE.h}
        x={MID_PLANE.x}
        y={MID_PLANE.y}
        cycleSec={MID_CYCLE_SEC}
        swayDeg={reduced ? 0 : 1.5}
        swayPhase={Math.PI / 3}
        cyclePhase={3}
      />
      {renderFG && (
        <CycledPlane
          textures={fernTextures}
          z={FG_PLANE.z}
          w={FG_PLANE.w}
          h={FG_PLANE.h}
          x={FG_PLANE.x}
          y={FG_PLANE.y}
          cycleSec={FG_CYCLE_SEC}
          swayDeg={reduced ? 0 : 3}
          swayPhase={Math.PI / 1.5}
          cyclePhase={5}
        />
      )}
    </>
  );
}

function CycledPlane({
  textures,
  z,
  w,
  h,
  x,
  y,
  cycleSec,
  swayDeg,
  swayPhase,
  cyclePhase = 0,
}: {
  textures: Texture[];
  z: number;
  w: number;
  h: number;
  x: number;
  y: number;
  cycleSec: number;
  swayDeg: number;
  swayPhase: number;
  /** Seconds offset on the texture cycle clock so planes don't change
   *  in lockstep. */
  cyclePhase?: number;
}): ReactNode {
  const meshRef = useRef<Mesh>(null);
  const frameRef = useRef(-1);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime + cyclePhase;
    // Frame cycling: pick which of the strip's textures to show.
    // The VEO strips have only 2-3 unique frames (slow hand-painted
    // motion), so cycling produces subtle ambient updates, not a
    // flipbook.
    const idx = Math.floor((t / cycleSec) * textures.length) % textures.length;
    if (idx !== frameRef.current) {
      frameRef.current = idx;
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      const next = textures[idx];
      if (next) {
        mat.map = next;
        mat.needsUpdate = true;
      }
    }
    // Wind sway around z-axis. Different phase per plane so they
    // don't move in lockstep. Tighter cadence (0.45 rad/s, ~14s
    // period) reads as meditative breeze.
    const swayRad = (swayDeg * Math.PI) / 180;
    meshRef.current.rotation.z = Math.sin(t * 0.45 + swayPhase) * swayRad;
    // Subtle y-axis rotation for parallax between planes.
    const orbRad = Math.sin(t * 0.15) * 0.02;
    meshRef.current.rotation.y = orbRad + (x !== 0 ? Math.sign(x) * 0.04 : 0);
  });

  // Initial texture: textures[0]. Cast for MeshBasicMaterial.map type
  // (Texture | Readonly<Texture> | null) under exactOptionalPropertyTypes.
  const initialMap = textures[0] as THREE.Texture | null;
  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={initialMap} transparent toneMapped={false} />
    </mesh>
  );
}