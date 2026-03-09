"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ParticleBG() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 768
    const PARTICLE_COUNT = isMobile ? 80 : 220
    const CONNECTION_DISTANCE = isMobile ? 120 : 150
    const MAX_CONNECTIONS = PARTICLE_COUNT * 3

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 300

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
    container.appendChild(renderer.domElement)

    // Particles
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300
      velocities[i * 3] = (Math.random() - 0.5) * 0.3
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: isMobile ? 2.5 : 2,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6)
    const lineColors = new Float32Array(MAX_CONNECTIONS * 6)
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Animation
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const pos = particleGeometry.attributes.position.array as Float32Array

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3] += velocities[i * 3]
        pos[i * 3 + 1] += velocities[i * 3 + 1]
        pos[i * 3 + 2] += velocities[i * 3 + 2]

        // Boundary wrap
        if (Math.abs(pos[i * 3]) > 300) velocities[i * 3] *= -1
        if (Math.abs(pos[i * 3 + 1]) > 300) velocities[i * 3 + 1] *= -1
        if (Math.abs(pos[i * 3 + 2]) > 150) velocities[i * 3 + 2] *= -1
      }

      particleGeometry.attributes.position.needsUpdate = true

      // Update connections
      let lineIndex = 0
      const lp = lineGeometry.attributes.position.array as Float32Array
      const lc = lineGeometry.attributes.color.array as Float32Array

      for (let i = 0; i < PARTICLE_COUNT && lineIndex < MAX_CONNECTIONS; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineIndex < MAX_CONNECTIONS; j++) {
          const dx = pos[i * 3] - pos[j * 3]
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE

            lp[lineIndex * 6] = pos[i * 3]
            lp[lineIndex * 6 + 1] = pos[i * 3 + 1]
            lp[lineIndex * 6 + 2] = pos[i * 3 + 2]
            lp[lineIndex * 6 + 3] = pos[j * 3]
            lp[lineIndex * 6 + 4] = pos[j * 3 + 1]
            lp[lineIndex * 6 + 5] = pos[j * 3 + 2]

            // teal color with distance-based alpha
            lc[lineIndex * 6] = 0.024 * alpha
            lc[lineIndex * 6 + 1] = 0.714 * alpha
            lc[lineIndex * 6 + 2] = 0.831 * alpha
            lc[lineIndex * 6 + 3] = 0.024 * alpha
            lc[lineIndex * 6 + 4] = 0.714 * alpha
            lc[lineIndex * 6 + 5] = 0.831 * alpha

            lineIndex++
          }
        }
      }

      // Zero out unused line segments
      for (let i = lineIndex; i < MAX_CONNECTIONS; i++) {
        lp[i * 6] = 0
        lp[i * 6 + 1] = 0
        lp[i * 6 + 2] = 0
        lp[i * 6 + 3] = 0
        lp[i * 6 + 4] = 0
        lp[i * 6 + 5] = 0
      }

      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true

      // Camera parallax
      camera.position.x += (mouse.x * 30 - camera.position.x) * 0.05
      camera.position.y += (-mouse.y * 30 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      renderer.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}
