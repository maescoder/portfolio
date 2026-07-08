'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

type Achievement = {
  code: string
  title: string
  stat: string
  detail: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    code: 'A1',
    title: 'LeetCode Knight',
    stat: 'Top ~5%',
    detail:
      'Of 5M+ users globally. 300+ problems solved, ranked in the top 10% in multiple weekly contests.',
  },
  {
    code: 'A2',
    title: 'Hackathon Finalist',
    stat: '100+ teams',
    detail:
      'Finalist at a college-level hackathon for the Pet Rescue System — real-time geolocation rescue matching.',
  },
  {
    code: 'B1',
    title: 'HackerRank 5-Star',
    stat: '5 ★',
    detail: '5-star Problem Solving badge. SQL (Intermediate) and Python certified.',
  },
  {
    code: 'B2',
    title: 'freeCodeCamp Cert',
    stat: '300 hrs',
    detail: 'JavaScript Algorithms & Data Structures Certification — 300 hours of coursework.',
  },
  {
    code: 'C1',
    title: 'Chegg Expert',
    stat: '500+ solved',
    detail:
      'Subject Matter Expert (CS & Math) — 500+ expert solutions with a 95% accuracy rating.',
  },
  {
    code: 'C2',
    title: 'AWS + IBM + Deloitte',
    stat: '3 certs',
    detail:
      'AWS Cloud Practitioner (in progress), IBM SkillsBuild AI Fundamentals, Deloitte Data Analytics Simulation (Forage).',
  },
]

const DISPLAY_MESSAGES = [
  'INSERT COIN TO COLLECT A WIN',
  'FRESHLY STOCKED ACHIEVEMENTS',
  'NO REFUNDS. ONLY BRAGGING RIGHTS.',
  'EACH ITEM 100% VERIFIED',
]

export function VendingMachineSection() {
  const rootRef = useRef<HTMLElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)
  const coinRef = useRef<HTMLDivElement>(null)
  const dispenseRef = useRef<(item: Achievement) => void>(() => {})
  const [selected, setSelected] = useState<Achievement | null>(null)
  const [dispensing, setDispensing] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [dragHint, setDragHint] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % DISPLAY_MESSAGES.length), 3200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.vm-machine',
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      )
      gsap.fromTo(
        '.vm-slot-item',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: rootRef.current, start: 'top 55%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    // Draggable coin: drop it on a slot to dispense that item,
    // or into the coin slot for a mystery pick
    const coin = coinRef.current
    if (!coin) return
    const drag = Draggable.create(coin, {
      type: 'x,y',
      zIndexBoost: true,
      onDragStart() {
        setDragHint(false)
        gsap.to(coin, { scale: 1.25, duration: 0.2 })
      },
      onDragEnd() {
        gsap.to(coin, { scale: 1, duration: 0.2 })
        // Draggable reports page coordinates; elementsFromPoint needs viewport coordinates
        const vx = this.pointerX - window.scrollX
        const vy = this.pointerY - window.scrollY
        const elements = document.elementsFromPoint(vx, vy)
        const hitSlot = elements.find(
          (el) => el instanceof HTMLElement && el.dataset.slot,
        ) as HTMLElement | undefined
        const hitCoinSlot = elements.some(
          (el) => el instanceof HTMLElement && el.dataset.coinslot,
        )

        if (hitSlot) {
          const item = ACHIEVEMENTS.find((a) => a.code === hitSlot.dataset.slot)
          if (item) dispenseRef.current(item)
        } else if (hitCoinSlot) {
          // mystery pick
          const item = ACHIEVEMENTS[Math.floor(Math.random() * ACHIEVEMENTS.length)]
          dispenseRef.current(item)
        } else {
          // wobble "nope" if dropped nowhere useful
          gsap.to(coin, { rotate: '+=20', yoyo: true, repeat: 3, duration: 0.06 })
        }
        // snap coin home
        gsap.to(coin, { x: 0, y: 0, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', delay: 0.15 })
      },
    })
    return () => drag.forEach((d) => d.kill())
  }, [])

  const dispense = useCallback(
    (item: Achievement) => {
      if (dispensing) return
      setDispensing(true)
      setSelected(null)

      const tl = gsap.timeline({
        onComplete: () => {
          setSelected(item)
          setDispensing(false)
        },
      })

      // coin drops into slot
      tl.fromTo(
        '.vm-coin-anim',
        { y: -40, opacity: 1, rotate: 0 },
        { y: 30, rotate: 360, duration: 0.5, ease: 'power2.in' },
      )
        .to('.vm-coin-anim', { opacity: 0, duration: 0.1 })
        // machine shakes
        .to('.vm-machine', { x: -4, duration: 0.05, repeat: 5, yoyo: true }, '-=0.05')
        .set('.vm-machine', { x: 0 })

      // the chosen slot item drops
      const slotEl = document.querySelector(`[data-slot="${item.code}"]`)
      if (slotEl) {
        tl.to(slotEl, { y: 14, duration: 0.15, ease: 'power2.in' }, '-=0.2')
          .to(slotEl, { y: 0, duration: 0.3, ease: 'bounce.out' })
      }

      // card pops out of tray
      if (trayRef.current) {
        tl.fromTo(
          trayRef.current,
          { scaleY: 0.6 },
          { scaleY: 1, duration: 0.3, ease: 'bounce.out' },
        )
      }
    },
    [dispensing],
  )

  useEffect(() => {
    dispenseRef.current = dispense
  }, [dispense])

  useEffect(() => {
    if (selected) {
      gsap.fromTo(
        '.vm-dispensed-card',
        { y: -60, opacity: 0, rotate: -6, scale: 0.8 },
        { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
      )
    }
  }, [selected])

  return (
    <section
      ref={rootRef}
      id="achievements"
      className="grain relative overflow-hidden border-b border-border px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-accent">
          {'02 — One Yes Led To Another'}
        </p>
        <h2 className="font-display mt-4 text-center text-5xl text-foreground md:text-7xl">
          The Achievement <span className="text-primary">Vending Machine</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
          {"Everyone's pressed a vending machine button hoping for a win. Here, every slot pays out. Drag the coin onto a slot — or press a button — and collect the receipt."}
        </p>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-16">
          {/* THE MACHINE */}
          <div className="vm-machine relative mx-auto w-full max-w-md">
            <div className="rounded-2xl border-4 border-primary/60 bg-card p-5 shadow-[0_0_60px_rgba(59,130,246,0.25)]">
              {/* neon header display */}
              <div className="animate-neon rounded-lg border border-primary bg-background px-4 py-3 text-center">
                <p className="font-display text-sm tracking-[0.2em] text-primary md:text-base">
                  {DISPLAY_MESSAGES[msgIndex]}
                  <span className="animate-blink text-accent">_</span>
                </p>
              </div>

              {/* slots grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-background/60 p-4">
                {ACHIEVEMENTS.map((item) => (
                  <button
                    key={item.code}
                    data-slot={item.code}
                    onClick={() => dispense(item)}
                    disabled={dispensing}
                    className="vm-slot-item group relative flex flex-col items-start gap-1 rounded-md border border-border bg-secondary p-3 text-left transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_rgba(251,191,36,0.25)] disabled:opacity-60"
                  >
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {item.code}
                    </span>
                    <span className="text-xs font-bold leading-tight text-secondary-foreground">
                      {item.title}
                    </span>
                    <span className="font-display text-lg text-accent">{item.stat}</span>
                  </button>
                ))}
              </div>

              {/* coin slot row */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="relative flex items-center gap-3">
                  <div
                    data-coinslot="true"
                    className="relative h-14 w-8 overflow-hidden rounded-md border border-border bg-background"
                  >
                    <div className="pointer-events-none absolute left-1/2 top-2 h-8 w-1 -translate-x-1/2 rounded-full bg-muted-foreground/40" />
                    {/* animated coin */}
                    <div className="vm-coin-anim pointer-events-none absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-accent opacity-0" />
                  </div>
                  <div
                    ref={coinRef}
                    className="animate-coin relative z-20 flex h-11 w-11 cursor-grab touch-none items-center justify-center rounded-full bg-accent shadow-[0_0_18px_rgba(251,191,36,0.5)] active:cursor-grabbing"
                    role="button"
                    aria-label="Drag this coin onto a slot to dispense an achievement, or into the coin slot for a mystery pick"
                    tabIndex={0}
                  >
                    <span className="font-display pointer-events-none text-sm text-accent-foreground">
                      SP
                    </span>
                  </div>
                  <p className="max-w-28 text-[10px] leading-tight text-muted-foreground">
                    {dragHint
                      ? 'Drag me onto a slot — or into the coin slot for a mystery pick'
                      : 'Coin slot = mystery pick'}
                  </p>
                </div>
                <p className="font-display text-xs tracking-widest text-muted-foreground">
                  EST. 2024 · JIIT
                </p>
              </div>

              {/* dispense tray */}
              <div
                ref={trayRef}
                className="mt-4 flex h-16 items-center justify-center rounded-lg border-2 border-border bg-background origin-bottom"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {dispensing ? 'Dispensing...' : 'Collect item here'}
                </p>
              </div>
            </div>

            {/* machine legs */}
            <div className="mx-8 flex justify-between">
              <div className="h-5 w-4 rounded-b bg-primary/40" />
              <div className="h-5 w-4 rounded-b bg-primary/40" />
            </div>
          </div>

          {/* DISPENSED CARD */}
          <div className="flex min-h-72 flex-col justify-center lg:sticky lg:top-24">
            {selected ? (
              <article className="vm-dispensed-card sticky-note rounded-sm bg-accent p-8 text-accent-foreground">
                <div className="flex items-start justify-between">
                  <span className="rounded bg-accent-foreground px-2 py-1 text-xs font-bold text-accent">
                    ITEM {selected.code}
                  </span>
                  <span className="font-display text-3xl">{selected.stat}</span>
                </div>
                <h3 className="font-display mt-4 text-3xl md:text-4xl">{selected.title}</h3>
                <p className="mt-3 text-pretty leading-relaxed">{selected.detail}</p>
                <p className="mt-6 border-t border-accent-foreground/20 pt-3 text-xs opacity-70">
                  Receipt · Dispensed from The Achievement Vending Machine · Verified 100%
                </p>
              </article>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-10 text-center">
                <p className="font-display text-2xl text-muted-foreground">
                  {dispensing ? 'Clunk... clunk...' : 'Nothing dispensed yet'}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Press any slot on the machine to drop an achievement here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
