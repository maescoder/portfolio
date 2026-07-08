'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

const RIBBON_PHRASES = [
  'SHIPPED 3+ PRODUCTION APPS',
  'LEETCODE KNIGHT — TOP 5%',
  'CODE BY DAY, DEBUG BY MIDNIGHT',
  '300+ PROBLEMS SOLVED',
  'BUILD. BREAK. REBUILD.',
  'JIIT NOIDA — MATH & COMPUTING',
]

export function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    // Hidden timer easter egg from the ideas doc: popup after 75s on page
    const t = setTimeout(() => setShowEasterEgg(true), 75000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    // Live IST clock — ties into "logical by day, creative by midnight"
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // Mouse parallax — portrait and headline drift subtly with the cursor
    const el = rootRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      gsap.to('.hero-portrait', { x: x * -30, y: y * -20, duration: 1.2, ease: 'power2.out' })
      gsap.to('.hero-parallax-text', { x: x * 18, y: y * 12, duration: 1, ease: 'power2.out' })
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-img-wrap',
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.hero-line',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.14,
          duration: 1.1,
          ease: 'power4.out',
          delay: 0.5,
        },
      )
      gsap.fromTo(
        '.hero-meta',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out', delay: 1.3 },
      )
      // subtle slow zoom on the portrait forever (feels like video, not a static image)
      gsap.to('.hero-portrait', {
        scale: 1.06,
        duration: 14,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      id="hero"
      className="grain relative flex min-h-svh flex-col justify-between overflow-hidden"
    >
      {/* Background portrait with black shadow like the reference */}
      <div className="hero-img-wrap absolute inset-0">
        <div className="hero-portrait absolute inset-0">
          <Image
            src="/images/sanjay.png"
            alt="Sanjay Pandey"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12">
        <p className="hero-meta text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Noida, India
        </p>
        <p className="hero-meta text-xs uppercase tracking-[0.3em] text-muted-foreground">
          JIIT &apos;28
        </p>
      </header>

      {/* Center content */}
      <div className="hero-parallax-text relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="overflow-hidden">
          <p className="hero-line text-sm uppercase tracking-[0.4em] text-accent md:text-base">
            Portfolio — Sanjay Pandey
          </p>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line font-display mt-4 text-5xl leading-[0.95] text-foreground md:text-8xl lg:text-9xl">
            Logical by day,
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line font-display text-5xl leading-[0.95] text-primary md:text-8xl lg:text-9xl">
            creative by midnight.
          </h1>
        </div>

        <div className="hero-meta mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground md:text-base">
          <span>
            Started as <span className="text-foreground underline decoration-accent decoration-2 underline-offset-4">Problem Solver</span>
          </span>
          <span>
            Became <span className="text-foreground underline decoration-accent decoration-2 underline-offset-4">Builder</span>
          </span>
          <span>
            Currently <span className="text-foreground underline decoration-accent decoration-2 underline-offset-4">Full-Stack Developer</span>
          </span>
        </div>

        <p className="hero-meta mt-6 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          Third-year student at JIIT Noida. Fastest way to know me — Best Work → Contact.
        </p>
      </div>

      {/* Bottom bar: live IST clock + current mode */}
      <div className="relative z-10 flex items-end justify-between px-6 pb-24 md:px-12">
        <div className="hero-meta">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Local time — Noida
          </p>
          <p className="font-display text-2xl text-foreground/70 md:text-4xl" suppressHydrationWarning>
            {time || '--:--:--'}
          </p>
        </div>
        <div className="hero-meta text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Current mode
          </p>
          <p className="font-display text-2xl text-accent md:text-4xl" suppressHydrationWarning>
            {time && Number.parseInt(time.slice(0, 2), 10) >= 8 && Number.parseInt(time.slice(0, 2), 10) < 20
              ? 'LOGICAL'
              : 'CREATIVE'}
          </p>
        </div>
      </div>

      {/* Ribbon with easter-egg phrases */}
      <div className="absolute bottom-0 left-0 right-0 z-20 -rotate-1 border-y border-primary/40 bg-primary py-3">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
          {[...RIBBON_PHRASES, ...RIBBON_PHRASES].map((phrase, i) => (
            <span
              key={i}
              className="font-display text-sm tracking-widest text-primary-foreground md:text-base"
            >
              {phrase} <span className="mx-4 text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hidden timer easter egg */}
      {showEasterEgg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-lg border border-accent bg-card p-4 shadow-2xl">
          <p className="text-sm leading-relaxed text-card-foreground">
            {"You've already spent more time here than most recruiters do on portfolios. Guess you like this — let's collaborate."}
          </p>
          <div className="mt-3 flex gap-2">
            <a
              href="#contact"
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground"
            >
              {"Let's talk"}
            </a>
            <button
              onClick={() => setShowEasterEgg(false)}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              Keep exploring
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
