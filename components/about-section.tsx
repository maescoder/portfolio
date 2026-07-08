'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TECH = [
  'JavaScript',
  'TypeScript',
  'Python',
  'C++',
  'Java',
  'SQL',
  'React.js',
  'Next.js',
  'Node.js',
  'Express.js',
  'Tailwind CSS',
  'Redux',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'AWS',
  'Docker',
  'Vercel',
]

// Node positions along the ink path (fraction of total path length)
const NODE_STOPS = [0.04, 0.18, 0.34, 0.5, 0.62, 0.74, 0.86, 0.97]

export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = document.querySelector<SVGPathElement>('.ink-path')
      const glowPath = document.querySelector<SVGPathElement>('.ink-path-glow')
      const dot = document.querySelector<SVGCircleElement>('.ink-dot')
      const nodes = gsap.utils.toArray<SVGCircleElement>('.ink-node')

      if (path && glowPath && dot) {
        const len = path.getTotalLength()
        gsap.set([path, glowPath], { strokeDasharray: len, strokeDashoffset: len })

        // Place nodes exactly on the path
        nodes.forEach((node, i) => {
          const p = path.getPointAtLength(len * (NODE_STOPS[i] ?? 0))
          node.setAttribute('cx', String(p.x))
          node.setAttribute('cy', String(p.y))
        })

        // The cinematic draw: line + glow draw together, dot rides the tip,
        // nodes pop alive the moment the ink reaches them.
        gsap.to([path, glowPath], {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.notebook-stage',
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.4,
            onUpdate: (self) => {
              const p = path.getPointAtLength(len * self.progress)
              gsap.set(dot, { attr: { cx: p.x, cy: p.y }, opacity: self.progress > 0.005 && self.progress < 0.995 ? 1 : 0 })
              nodes.forEach((node, i) => {
                const active = self.progress >= (NODE_STOPS[i] ?? 0)
                if (active && node.dataset.on !== '1') {
                  node.dataset.on = '1'
                  gsap.fromTo(
                    node,
                    { opacity: 0, scale: 0, transformOrigin: 'center center' },
                    { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(3)' },
                  )
                } else if (!active && node.dataset.on === '1') {
                  node.dataset.on = '0'
                  gsap.to(node, { opacity: 0, scale: 0, duration: 0.25 })
                }
              })
            },
          },
        })
      }

      // ---- CINEMATIC SCRUBBED MOTION ----
      // Every scrapbook item continuously drifts/rotates with the touchpad,
      // not one-shot reveals: enters from below+tilted, settles, then drifts up.
      gsap.utils.toArray<HTMLElement>('.nb-item').forEach((el) => {
        const rot = Number(el.dataset.rot || 0)
        const drift = Number(el.dataset.drift || -40)
        gsap.fromTo(
          el,
          { y: 140, rotate: rot + (rot >= 0 ? 10 : -10), scale: 0.8, opacity: 0 },
          {
            keyframes: [
              { y: 0, rotate: rot, scale: 1, opacity: 1, ease: 'power2.out' },
              { y: drift, rotate: rot * 0.5, ease: 'none' },
            ],
            scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 15%', scrub: 0.5 },
          },
        )
      })

      // Headline lines write themselves in, tied to scroll
      gsap.fromTo(
        '.nb-headline > *',
        { opacity: 0, x: -60, rotate: -2 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.nb-headline', start: 'top 95%', end: 'top 40%', scrub: 0.5 },
        },
      )

      // Annotations slide in from the side with scrub
      gsap.utils.toArray<HTMLElement>('.nb-note').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: i % 2 === 0 ? 80 : -80, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 45%', scrub: 0.5 },
          },
        )
      })

      // Polaroid: bigger cinematic parallax + counter-rotation
      gsap.fromTo(
        '.nb-polaroid',
        { y: 80, rotate: 10 },
        {
          y: -80,
          rotate: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.nb-polaroid', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )

      // The whole stage subtly zooms as you travel through it
      gsap.fromTo(
        '.nb-inner',
        { scale: 0.97 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.notebook-stage', start: 'top bottom', end: 'top top', scrub: 0.8 },
        },
      )

      // Cute stickers: pop in with scroll, then idle-float forever
      gsap.utils.toArray<HTMLElement>('.nb-sticker').forEach((el, i) => {
        const rot = Number(el.dataset.rot || 0)
        gsap.fromTo(
          el,
          { scale: 0, rotate: rot - 25, opacity: 0 },
          {
            scale: 1,
            rotate: rot,
            opacity: 1,
            ease: 'back.out(2.5)',
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: 0.5 },
          },
        )
        // continuous gentle bobbing + wiggle so they always feel alive
        gsap.to(el, {
          y: '+=12',
          rotate: rot + (i % 2 === 0 ? 5 : -5),
          duration: 2 + i * 0.35,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // Arrowhead pops at the end
      gsap.fromTo(
        '.ink-arrow',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '.nb-end', start: 'top 80%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="about" className="relative overflow-hidden border-b border-border">
      {/* ======= DARK NOTEBOOK STAGE ======= */}
      <div className="notebook-paper notebook-stage relative text-foreground">
        {/* faint margin line like a real notebook */}
        <div className="pointer-events-none absolute left-8 top-0 h-full w-px bg-destructive/25 md:left-16" />

        {/* ---- The scroll-drawn glowing ink line ---- */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1000 2600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          {/* glow underlay */}
          <path
            className="ink-path-glow ink-glow"
            d="M 760 130
               C 900 170, 880 300, 700 320
               C 500 345, 430 420, 520 520
               C 610 620, 830 600, 800 760
               C 775 890, 500 850, 380 950
               C 260 1050, 330 1180, 520 1200
               C 720 1220, 800 1300, 720 1420
               C 640 1540, 360 1500, 300 1640
               C 245 1770, 430 1860, 620 1840
               C 810 1820, 850 1960, 740 2080
               C 640 2190, 420 2160, 400 2300
               C 385 2410, 520 2470, 640 2450"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* crisp ink line */}
          <path
            className="ink-path"
            d="M 760 130
               C 900 170, 880 300, 700 320
               C 500 345, 430 420, 520 520
               C 610 620, 830 600, 800 760
               C 775 890, 500 850, 380 950
               C 260 1050, 330 1180, 520 1200
               C 720 1220, 800 1300, 720 1420
               C 640 1540, 360 1500, 300 1640
               C 245 1770, 430 1860, 620 1840
               C 810 1820, 850 1960, 740 2080
               C 640 2190, 420 2160, 400 2300
               C 385 2410, 520 2470, 640 2450"
            stroke="#60a5fa"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* nodes that light up as ink reaches them */}
          {NODE_STOPS.map((_, i) => (
            <circle key={i} className="ink-node" r="7" fill="#60a5fa" opacity="0" />
          ))}
          {/* traveling dot at the tip of the ink */}
          <circle className="ink-dot" r="9" fill="#93c5fd" opacity="0" />
        </svg>

        <div className="nb-inner relative mx-auto max-w-5xl px-10 py-20 md:px-20 md:py-28">
          {/* kicker */}
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {'01 — The Beginning'}
          </p>

          {/* handwritten intro note (top-right) */}
          <div className="nb-note sticky-note absolute right-6 top-14 hidden w-52 rotate-2 bg-[#fffef5] p-3 md:block">
            <p className="font-hand text-lg leading-snug text-[#333]">
              {"I'm an open book. Here's the unfiltered timeline of how I figured things out."}
            </p>
          </div>

          {/* ---- BIG HANDWRITTEN HEADLINE ---- */}
          <div className="nb-headline mt-6 max-w-2xl">
            <p className="font-hand text-3xl text-primary md:text-4xl">how it all started.</p>
            <p className="font-marker text-4xl leading-tight md:text-6xl">I started</p>
            <p className="font-marker text-4xl leading-tight text-primary md:text-6xl">
              solving problems
            </p>
            <p className="font-marker text-4xl leading-tight md:text-6xl">in first year</p>
            <p className="font-marker text-4xl leading-tight md:text-6xl">
              {"coz' I wanted to"}
            </p>
            <p className="font-marker text-4xl leading-tight md:text-6xl">
              see my{' '}
              <span className="relative inline-block text-primary">
                code
                <svg
                  className="absolute -inset-x-2 -inset-y-1"
                  viewBox="0 0 120 60"
                  fill="none"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="60"
                    cy="30"
                    rx="56"
                    ry="26"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    strokeDasharray="6 5"
                  />
                </svg>
              </span>{' '}
              actually work {':)'}
            </p>
          </div>

          {/* cute sticker: coffee buddy next to headline */}
          <img
            src="/images/sticker-coffee.png"
            alt=""
            className="nb-sticker absolute right-16 top-64 hidden w-20 rounded-full md:block lg:w-24"
            data-rot="8"
          />

          {/* body paragraph in a bordered box */}
          <div
            className="nb-item relative mt-10 max-w-xl border-2 border-foreground/40 bg-card/60 p-5 backdrop-blur-sm"
            data-rot="-0.5"
            data-drift="-30"
          >
            {/* laptop sticker peeking over the corner of the box */}
            <img
              src="/images/sticker-laptop.png"
              alt=""
              className="nb-sticker absolute -right-8 -top-9 w-16 rounded-full md:w-20"
              data-rot="-10"
            />
            <p className="font-hand text-xl leading-relaxed text-foreground/85 md:text-2xl">
              {"I had no idea what 'system design' was in first year. I was just grinding LeetCode and building whatever web apps I could think of through hackathons and side projects. I didn't know what 'scalable architecture' meant. I kept building things because I liked seeing them work."}
            </p>
          </div>

          {/* annotation next to line */}
          <div className="nb-note ml-auto mt-10 max-w-xs md:mr-24">
            <p className="font-hand text-2xl leading-snug text-primary">
              It started as solving problems. Then it became a way of thinking. Building came
              later.
            </p>
          </div>

          {/* polaroid of Sanjay */}
          <div
            className="nb-item nb-polaroid polaroid ml-auto mt-6 w-48 rotate-3 p-3 pb-10 md:mr-10 md:w-56"
            data-rot="3"
            data-drift="0"
          >
            <img
              src="/images/sanjay.png"
              alt="Sanjay Pandey"
              className="h-44 w-full object-cover md:h-52"
            />
            <p className="font-hand mt-2 text-center text-xl text-[#333]">Sanjay Pandey</p>
            <p className="font-hand text-center text-sm text-[#888]">
              chai + late-night commits addicted
            </p>
          </div>

          {/* ======= PART 2: ONE THING LED TO ANOTHER ======= */}
          <p className="mt-24 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {'02 — One Thing Led to Another'}
          </p>

          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {/* left column */}
            <div className="flex flex-col gap-8">
              {/* sticky note: code with a purpose */}
              <div
                className="nb-item sticky-note w-64 -rotate-2 bg-[#fffef5] p-4"
                data-rot="-2"
                data-drift="-45"
              >
                <p className="font-marker text-sm text-[#1a1a1a]">CODE WITH A PURPOSE</p>
                <p className="font-hand mt-2 text-lg leading-snug text-[#333]">
                  {"I'm an engineer at heart. I obsess over clean logic, but I love it even more when my code helps real people take action."}
                </p>
              </div>
              <p className="nb-note font-hand text-2xl text-primary">
                clean code that actually ships.
              </p>

              {/* places I've hustled at */}
              <div className="nb-item" data-rot="0" data-drift="-25">
                <p className="font-marker text-base text-foreground">{'// WHERE THE HOURS WENT'}</p>
                <ul className="font-hand mt-3 space-y-1.5 text-xl leading-snug text-foreground/85">
                  <li>— Shipped 3+ production full-stack apps with live users.</li>
                  <li>— Built an animal-rescue platform connecting shelters faster.</li>
                  <li>— Built a price-tracking tool saving users money per purchase.</li>
                  <li>— Solved 300+ DSA problems, contest after contest.</li>
                </ul>
                <p className="font-hand mt-2 text-lg text-accent">learned a lot here!</p>
              </div>
            </div>

            {/* right column: taped stat cards */}
            <div className="flex flex-col items-end gap-8">
              <div
                className="nb-item stat-card relative w-56 rotate-1 border-2 border-primary p-4"
                data-rot="1"
                data-drift="-55"
              >
                <div className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3" />
                {/* knight buddy guarding his card */}
                <img
                  src="/images/sticker-knight.png"
                  alt=""
                  className="nb-sticker absolute -left-12 -top-10 w-16 rounded-full md:w-20"
                  data-rot="-8"
                />
                <p className="font-display text-3xl text-primary">KNIGHT</p>
                <p className="font-mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  LeetCode · top ~5%
                </p>
                <p className="font-hand mt-2 text-lg leading-tight text-foreground/85">
                  of 5M+ users worldwide
                </p>
              </div>

              <p className="nb-note font-hand max-w-48 text-right text-xl leading-snug text-primary">
                crazy what happens when you just keep solving stuff
              </p>

              <div
                className="nb-item stat-card relative w-56 -rotate-2 border-2 border-dashed border-foreground/50 p-4"
                data-rot="-2"
                data-drift="-35"
              >
                <div className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2" />
                <p className="font-display text-3xl text-foreground">300+</p>
                <p className="font-mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  DSA problems solved
                </p>
                <p className="font-hand mt-2 text-lg leading-tight text-foreground/85">
                  scaled one problem at a time
                </p>
              </div>

              <div
                className="nb-item stat-card relative w-56 rotate-2 border-2 border-destructive p-4"
                data-rot="2"
                data-drift="-50"
              >
                <div className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2" />
                {/* rocket blasting off the shipped-apps card */}
                <img
                  src="/images/sticker-rocket.png"
                  alt=""
                  className="nb-sticker absolute -right-10 -top-12 w-16 rounded-full md:w-20"
                  data-rot="12"
                />
                <p className="font-display text-3xl text-destructive">3+</p>
                <p className="font-mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  production apps shipped
                </p>
                <p className="font-hand mt-2 text-lg leading-tight text-foreground/85">
                  with real, live users
                </p>
              </div>
            </div>
          </div>

          {/* ======= ENDING ======= */}
          <div className="nb-end relative mt-24 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            {/* lightbulb buddy over the PS note */}
            <img
              src="/images/sticker-bulb.png"
              alt=""
              className="nb-sticker absolute -top-16 left-4 w-16 rounded-full md:w-20"
              data-rot="-6"
            />
            <div className="max-w-md">
              <p className="font-marker text-base text-foreground">{'PS //'}</p>
              <p className="font-hand mt-2 text-2xl leading-snug text-foreground/85">
                The goal is simple: find teams building incredible things, and grow together —
                currently a third-year at JIIT Noida looking for SDE / full-stack roles.
              </p>
            </div>

            <div className="relative">
              {/* arrowhead at the end of the ink line */}
              <svg
                className="ink-arrow absolute -left-10 -top-6 h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12 L20 12 M14 6 L20 12 L14 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div
                className="nb-item sticky-note w-44 rotate-3 bg-[#fffef5] p-3"
                data-rot="3"
                data-drift="0"
              >
                <p className="font-hand text-xl leading-snug text-[#333]">
                  still figuring out things {':)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack marquee */}
      <div className="overflow-hidden border-t border-border py-4">
        <div className="animate-marquee-slow flex w-max gap-10 whitespace-nowrap">
          {[...TECH, ...TECH].map((tech, i) => (
            <span key={i} className="font-display text-lg text-muted-foreground">
              {tech} <span className="mx-3 text-primary">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
