import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { getScrollProgressThroughSection, easeInOutCubic } from '../../utils/heroScrollProgress'

// ── 3D waypoints ────────────────────────────────────────────────────────────
const CENTER_POS = [0, -1, 0]
/**
 * Hero path: upper-left → lower-right, kept inside the camera frustum (avoid extreme X/Y).
 * Tuned for camera pulled back + slightly wider FOV so start/end stay on-screen.
 */
const HERO_PARK_POS = [-3.35, -0.05, 0.1]
/** End of hero + guide pose for sections after hero */
const GUIDE_POS  = [2.35, -1.3, -0.5]
/** Yaw aligned with diagonal (XZ); small offset if model forward axis differs */
const HERO_PATH_YAW =
  Math.atan2(GUIDE_POS[0] - HERO_PARK_POS[0], GUIDE_POS[2] - HERO_PARK_POS[2]) + 0.08
const PARK_POS   = [0, -1, 0]   // returns to center to "park"

/** Uniform scale vs prior art direction (1.5 = 50% larger on screen) */
const ROBOT_SCALE_MUL = 1.5

useGLTF.preload('/models/robot.glb')

// ── Helpers ─────────────────────────────────────────────────────────────────
function easeOutCubic(t) {
  const c = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - c, 3)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

// ── Section-aware scroll refs ────────────────────────────────────────────────
// Section IDs (must match RoboticsLandingPage.jsx)
const SECTIONS = [
  { id: 'section-hero',        key: 'hero' },
  { id: 'section-meet-argo',   key: 'meet-argo' },
  { id: 'section-industries',  key: 'industries' },
  { id: 'section-real-world',  key: 'real-world' },
  { id: 'section-footer',      key: 'footer' },
]

function useSectionProgressRefs() {
  const sectionRef         = useRef('hero')
  const sectionProgressRef = useRef(0)

  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight

      for (const cfg of SECTIONS) {
        const el = document.getElementById(cfg.id)
        if (!el) continue

        const top = el.offsetTop
        const height = el.offsetHeight || 1
        const bottom = top + height

        // Section active when its vertical range intersects the viewport
        if (scrollY + vh > top && scrollY < bottom) {
          sectionRef.current = cfg.key
          sectionProgressRef.current = getScrollProgressThroughSection(el)
          return
        }
      }
    }

    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  return { sectionRef, sectionProgressRef }
}

// ── Robot model ──────────────────────────────────────────────────────────────
function RobotModel({ sectionRef, sectionProgressRef }) {
  const group       = useRef()
  const { scene }   = useGLTF('/models/robot.glb')
  const materialsRef = useRef([])

  // Cache materials once for efficient per-frame opacity updates
  useEffect(() => {
    const mats = []
    scene.traverse(obj => {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true
        obj.material.opacity     = 0
        mats.push(obj.material)
      }
    })
    materialsRef.current = mats
  }, [scene])

  useFrame((state, delta) => {
    if (!group.current) return

    const section = sectionRef.current
    const prog    = sectionProgressRef.current

    let targetOpacity = 0
    let targetScale   = 0.8 * ROBOT_SCALE_MUL
    let targetPos     = [...CENTER_POS]
    let targetRotX    = 0
    let targetRotY    = 0
    let targetRotZ    = 0

    // ── Hero: parked left-upper → drive to right-bottom as user scrolls (p = 0..1) ──
    if (section === 'hero') {
      const p = prog
      const clock = state.clock.getElapsedTime()
      // Scroll-only motion: still target when user stops scrolling (p fixed)
      const te = easeInOutCubic(p)
      const moveW = Math.sin(te * Math.PI)

      targetPos = [
        lerp(HERO_PARK_POS[0], GUIDE_POS[0], te),
        lerp(HERO_PARK_POS[1], GUIDE_POS[1], te),
        lerp(HERO_PARK_POS[2], GUIDE_POS[2], te),
      ]
      targetOpacity = lerp(0.45, 1, Math.min(1, te * 1.05))
      targetScale = 0.82 * ROBOT_SCALE_MUL
      targetRotY = lerp(HERO_PATH_YAW * 0.45, HERO_PATH_YAW, te)
      // Driving feel: slight pitch into the move + tiny roll only while mid-path
      targetRotX = -0.04 * moveW
      targetRotZ = Math.sin(clock * 11) * 0.01 * moveW

    // ── Core idea: minimal idle at guide (no long wobble) ────────────────────
    } else if (section === 'meet-argo') {
      const clock = state.clock.getElapsedTime()
      const idleY = Math.sin(clock * 1.15) * 0.02
      targetOpacity = 1
      targetScale = 0.9 * ROBOT_SCALE_MUL
      targetPos = [GUIDE_POS[0], GUIDE_POS[1] + idleY, GUIDE_POS[2]]
      targetRotY = HERO_PATH_YAW
      targetRotX = Math.sin(clock * 1) * 0.01
      targetRotZ = Math.sin(clock * 1.2) * 0.008

    // ── Industries: minimal idle at guide ──────────────────────────────────
    } else if (section === 'industries') {
      const clock = state.clock.getElapsedTime()
      const idleY = Math.sin(clock * 1.15) * 0.02
      targetOpacity = 1
      targetScale   = 0.9 * ROBOT_SCALE_MUL
      targetPos     = [GUIDE_POS[0], GUIDE_POS[1] + idleY, GUIDE_POS[2]]
      targetRotY    = HERO_PATH_YAW
      targetRotX    = Math.sin(clock * 1) * 0.01
      targetRotZ    = Math.sin(clock * 1.2) * 0.008

    // ── Real World: drive back to center and park ─────────────────────────
    } else if (section === 'real-world') {
      const returnT  = easeOutCubic(prog)
      targetOpacity  = 1
      targetScale    = lerp(0.9 * ROBOT_SCALE_MUL, 1.2 * ROBOT_SCALE_MUL, returnT)
      targetPos      = [
        lerp(GUIDE_POS[0], PARK_POS[0], returnT),
        lerp(GUIDE_POS[1], PARK_POS[1], returnT),
        lerp(GUIDE_POS[2], PARK_POS[2], returnT),
      ]
      targetRotY     = lerp(HERO_PATH_YAW, 0, returnT)
      targetRotX     = 0
      targetRotZ     = 0

    // ── Footer: dissolve quickly in the first 30% of scroll, then gone ────
    } else if (section === 'footer') {
      const dissolveT = Math.min(1, prog / 0.05)
      targetOpacity = lerp(1, 0, dissolveT)
      targetScale   = 1.2 * ROBOT_SCALE_MUL
      targetPos     = [...PARK_POS]
      targetRotY    = 0
      targetRotX    = 0
      targetRotZ    = 0
    }

    // ── Smooth position / scale / rotation ───────────────────────────────
    const s = section === 'hero' ? Math.min(1, 4.8 * delta) : Math.min(1, 3 * delta)

    group.current.position.x   = lerp(group.current.position.x, targetPos[0], s)
    group.current.position.y   = lerp(group.current.position.y, targetPos[1], s)
    group.current.position.z   = lerp(group.current.position.z, targetPos[2], s)
    group.current.rotation.x     = lerp(group.current.rotation.x || 0, targetRotX, s)
    group.current.rotation.y   = lerp(group.current.rotation.y || 0, targetRotY, s)
    group.current.rotation.z   = lerp(group.current.rotation.z || 0, targetRotZ, s)

    const curScale = group.current.scale.x || targetScale
    const nxtScale = lerp(curScale, targetScale, s)
    group.current.scale.set(nxtScale, nxtScale, nxtScale)

    // Opacity: lerp with a faster factor so it's smooth but not sluggish
    const os = Math.min(1, 10 * delta)
    materialsRef.current.forEach(mat => {
      mat.opacity = lerp(mat.opacity ?? 0, targetOpacity, os)
    })
  })

  return <primitive ref={group} object={scene} />
}

function RobotFallback() {
  return <group />
}

// ── Main export ──────────────────────────────────────────────────────────────
const RobotGuide = () => {
  const { sectionRef, sectionProgressRef } = useSectionProgressRefs()

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{ position: [0, 1.1, 6.25], fov: 50, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, 3, -3]} intensity={1.5} />

        <Suspense fallback={<RobotFallback />}>
          <RobotModel sectionRef={sectionRef} sectionProgressRef={sectionProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default RobotGuide
