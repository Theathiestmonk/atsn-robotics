import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { getScrollProgressThroughSection, easeInOutCubic } from '../../utils/heroScrollProgress'

// ── 3D waypoints ────────────────────────────────────────────────────────────
const CENTER_POS = [0, -1, 0]
/** Start: left, Y=0.7 */
const HERO_PARK_POS = [-3.35, 0.7, 0]
/** End: far right, off-screen at Y=0.7 */
const GUIDE_POS  = [7, 0.7, 0]
/** X-only motion left→right: yaw faces right */
const HERO_PATH_YAW = 0

/** Uniform scale: 33% larger than prior (1.5 * 1.33) */
const ROBOT_SCALE_MUL = 2.0

useGLTF.preload('/models/robot.glb')

// ── Helpers ─────────────────────────────────────────────────────────────────
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

function useSectionProgressRefs(scrollRef) {
  const sectionRef         = useRef('hero')
  const sectionProgressRef = useRef(0)

  const updateSection = (scrollY) => {
    const vh = window.innerHeight
    for (const cfg of SECTIONS) {
      const el = document.getElementById(cfg.id)
      if (!el) continue
      const top = el.offsetTop
      const height = el.offsetHeight || 1
      const bottom = top + height
      if (scrollY + vh > top && scrollY < bottom) {
        sectionRef.current = cfg.key
        sectionProgressRef.current = getScrollProgressThroughSection(el, scrollY)
        return
      }
    }
  }

  useEffect(() => {
    if (scrollRef) {
      let raf = 0
      const tick = () => {
        updateSection(scrollRef.current)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }
    const handle = () => updateSection(window.scrollY)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [scrollRef])

  return { sectionRef, sectionProgressRef }
}

// ── Robot model ──────────────────────────────────────────────────────────────
function RobotModel({ sectionRef, sectionProgressRef, heroProgressRef }) {
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
    const prog    = section === 'hero' && heroProgressRef ? heroProgressRef.current : sectionProgressRef.current

    let targetOpacity = 0
    let targetScale   = 0.8 * ROBOT_SCALE_MUL
    let targetPos     = [...CENTER_POS]
    let targetRotX    = 0
    let targetRotY    = 0
    let targetRotZ    = 0

    // ── Hero only: robot visible. Other sections: hidden ──
    if (section === 'hero') {
      const p = prog
      const clock = state.clock.getElapsedTime()
      const te = easeInOutCubic(p)
      const moveW = Math.sin(te * Math.PI)

      targetPos = [
        lerp(HERO_PARK_POS[0], GUIDE_POS[0], te),
        HERO_PARK_POS[1],
        0,
      ]
      targetOpacity = lerp(0.45, 1, Math.min(1, te * 1.05))
      targetScale = 0.82 * ROBOT_SCALE_MUL
      targetRotY = HERO_PATH_YAW
      targetRotX = -0.04 * moveW
      targetRotZ = Math.sin(clock * 11) * 0.01 * moveW
    } else {
      // Keep position at hero exit; do not lerp toward CENTER_POS (visible "return" bug).
      targetOpacity = 0
      targetPos = [GUIDE_POS[0], GUIDE_POS[1], GUIDE_POS[2]]
      targetScale = 0.82 * ROBOT_SCALE_MUL
      targetRotY = HERO_PATH_YAW
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
const RobotGuide = ({ heroProgressRef, scrollRef }) => {
  const { sectionRef, sectionProgressRef } = useSectionProgressRefs(scrollRef)

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden max-w-full">
      <Canvas
        className="!block h-full w-full max-w-full touch-none"
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 1.1, 6.25], fov: 50, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, 3, -3]} intensity={1.5} />

        <Suspense fallback={<RobotFallback />}>
          <RobotModel
            sectionRef={sectionRef}
            sectionProgressRef={sectionProgressRef}
            heroProgressRef={heroProgressRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default RobotGuide
