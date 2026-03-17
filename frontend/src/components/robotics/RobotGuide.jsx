import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

// ── 3D waypoints ────────────────────────────────────────────────────────────
const CENTER_POS = [0, -1, 0]
const GUIDE_POS  = [2.5, -1, 0]
const PARK_POS   = [0, -1, 0]   // returns to center to "park"

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
      const viewportCenter = window.scrollY + window.innerHeight * 0.5

      for (const cfg of SECTIONS) {
        const el = document.getElementById(cfg.id)
        if (!el) continue

        const top    = el.offsetTop
        const height = el.offsetHeight || 1

        if (viewportCenter >= top && viewportCenter <= top + height) {
          sectionRef.current         = cfg.key
          sectionProgressRef.current = Math.max(0, Math.min(1, (viewportCenter - top) / height))
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
    let targetScale   = 0.8
    let targetPos     = [...CENTER_POS]
    let targetRotY    = 0

    // ── Hero: robot fully hidden ──────────────────────────────────────────
    if (section === 'hero') {
      targetOpacity = 0
      targetScale   = 0.7
      targetPos     = [...CENTER_POS]
      targetRotY    = 0

    // ── Meet Argo: fade in → hold at center → then drive right ──────────
    } else if (section === 'meet-argo') {
      // fast fade-in in the first 20% of the section
      const fadeT = Math.min(1, prog / 0.2)
      targetOpacity = lerp(0, 1, fadeT)

      // hold at center for first 17% of section ("breathe"), then drive right
      const holdEnd = 0.17
      const driveT  = easeOutCubic(Math.max(0, (prog - holdEnd) / (1 - holdEnd)))
      targetScale   = lerp(1.2, 0.9, driveT)
      targetPos     = [
        lerp(CENTER_POS[0], GUIDE_POS[0], driveT),
        lerp(CENTER_POS[1], GUIDE_POS[1], driveT),
        lerp(CENTER_POS[2], GUIDE_POS[2], driveT),
      ]
      // lean slightly toward direction of travel before settling
      targetRotY = (Math.PI / 6) * driveT

    // ── Industries: stay in guide mode, subtle idle ───────────────────────
    } else if (section === 'industries') {
      const wobble  = Math.sin(state.clock.getElapsedTime() * 1.8) * 0.12
      targetOpacity = 1
      targetScale   = 0.9
      targetPos     = [GUIDE_POS[0], GUIDE_POS[1] + wobble * 0.15, GUIDE_POS[2] + wobble * 0.25]
      targetRotY    = Math.PI / 6

    // ── Real World: drive back to center and park ─────────────────────────
    } else if (section === 'real-world') {
      const returnT  = easeOutCubic(prog)
      targetOpacity  = 1
      targetScale    = lerp(0.9, 1.2, returnT)
      targetPos      = [
        lerp(GUIDE_POS[0], PARK_POS[0], returnT),
        lerp(GUIDE_POS[1], PARK_POS[1], returnT),
        lerp(GUIDE_POS[2], PARK_POS[2], returnT),
      ]
      targetRotY     = lerp(Math.PI / 6, 0, returnT)

    // ── Footer: dissolve quickly in the first 30% of scroll, then gone ────
    } else if (section === 'footer') {
      const dissolveT = Math.min(1, prog / 0.05)
      targetOpacity = lerp(1, 0, dissolveT)
      targetScale   = 1.2
      targetPos     = [...PARK_POS]
      targetRotY    = 0
    }

    // ── Smooth position / scale / rotation ───────────────────────────────
    const s = 3 * delta

    group.current.position.x   = lerp(group.current.position.x, targetPos[0], s)
    group.current.position.y   = lerp(group.current.position.y, targetPos[1], s)
    group.current.position.z   = lerp(group.current.position.z, targetPos[2], s)
    group.current.rotation.y   = lerp(group.current.rotation.y || 0, targetRotY, s)

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
        camera={{ position: [0, 1.2, 5], fov: 45 }}
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
