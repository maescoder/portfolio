'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { label: 'About Me', note: 'Who I am & how I got here', href: '#about' },
  { label: 'Achievements', note: 'Insert a coin, collect a win', href: '#achievements' },
  { label: 'Projects & Internships', note: 'The work that started it all', href: '#projects' },
  { label: 'Best Work', note: "Work I'm most proud of", href: '#best-work' },
  { label: 'Contact Me', note: 'Say hi before overthinking it', href: '#contact' },
]

export function NavIndexSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-item',
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      )
      gsap.fromTo(
        '.nav-note-card',
        { rotate: 8, y: 60, opacity: 0 },
        {
          rotate: -2,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative border-b border-border px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_360px]">
        <nav aria-label="Portfolio sections">
          <p className="mb-8 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            (Directly click on the section you want to go to)
          </p>
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="nav-item group border-b border-border">
                <a
                  href={item.href}
                  className="flex flex-col gap-1 py-6 transition-colors md:flex-row md:items-baseline md:justify-between"
                >
                  <span className="font-display text-3xl text-foreground transition-all group-hover:translate-x-3 group-hover:text-primary md:text-5xl">
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground">({item.note})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <aside className="nav-note-card sticky-note h-fit self-center rounded-sm bg-accent p-6 text-accent-foreground lg:mt-12">
          <p className="font-display text-xl">A quick note</p>
          <p className="mt-3 text-sm leading-relaxed">
            The entire portfolio is worth a look. But if you&apos;re short on time, jump straight to
            the{' '}
            <a href="#best-work" className="font-bold underline underline-offset-2">
              Best Work
            </a>{' '}
            section.
          </p>
          <p className="mt-4 text-xs opacity-70">— Sanjay</p>
        </aside>
      </div>
    </section>
  )
}
