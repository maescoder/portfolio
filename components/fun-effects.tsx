'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Global "fun layer":
 * - Cursor spotlight glow that follows the mouse
 * - Scroll progress bar at the top
 * - Random encouraging toast messages while scrolling (from the ideas doc)
 */
export function FunEffects() {
  const glowRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState<string | null>(null)
  const shownRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return
    const onMove = (e: MouseEvent) => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const messages: Record<number, string> = {
      25: 'Nice, you scrolled past the boring part. It only gets better.',
      55: "Halfway through. The vending machine doesn't restock itself — go press a button.",
      85: "Almost at the end. The contact section doesn't bite.",
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`

      for (const key of Object.keys(messages)) {
        const threshold = Number(key)
        if (pct >= threshold && !shownRef.current.has(threshold)) {
          shownRef.current.add(threshold)
          setToast(messages[threshold])
          setTimeout(() => setToast(null), 4500)
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <div className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
        <div ref={barRef} className="h-full bg-accent transition-none" style={{ width: '0%' }} />
      </div>

      {/* Cursor spotlight glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[55] hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={{
          width: 480,
          height: 480,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Scroll toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[70] w-max max-w-[90vw] -translate-x-1/2 animate-float rounded-full border border-accent/60 bg-card px-5 py-2.5 shadow-2xl">
          <p className="text-xs text-card-foreground md:text-sm">{toast}</p>
        </div>
      )}
    </>
  )
}
