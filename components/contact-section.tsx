'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ContactSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-title',
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      )
      gsap.fromTo(
        '.contact-link',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 55%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const links = [
    { label: 'Mail', href: 'mailto:hpspap00@gmail.com', display: 'hpspap00@gmail.com' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sanjay-pandey-67384a167/',
      display: 'linkedin.com/in/sanjay-pandey',
    },
    { label: 'GitHub', href: 'https://github.com/Maescoder', display: 'github.com/Maescoder' },
    {
      label: 'LeetCode',
      href: 'https://leetcode.com/u/maescode/',
      display: 'leetcode.com/u/maescode',
    },
  ]

  return (
    <section
      ref={rootRef}
      id="contact"
      className="grain relative overflow-hidden px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-6xl text-center">
        <div className="overflow-hidden">
          <h2 className="contact-title font-display text-6xl leading-[0.95] text-foreground md:text-9xl">
            Contact
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="contact-title font-display text-6xl leading-[0.95] text-primary md:text-9xl">
            Me
          </h2>
        </div>

        <p className="contact-link mx-auto mt-8 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Ready to work together? Drop an email to discuss internships, collaborations, or just to
          say hi.
        </p>
        <p className="contact-link mt-2 text-sm italic text-accent">
          → say hi before overthinking it
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="contact-link group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_30px_rgba(59,130,246,0.25)]"
            >
              <p className="font-display text-2xl text-card-foreground transition-colors group-hover:text-primary">
                {link.label}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{link.display}</p>
            </a>
          ))}
        </div>

        <div className="contact-link mt-20 border-t border-border pt-10">
          <p className="text-sm text-muted-foreground">
            Bye, have a great day at your job. Hoping you get more creative portfolios to look at.
          </p>
          <p className="font-display mt-6 text-4xl text-foreground md:text-6xl">
            Sanjay Pandey
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Third-year student at JIIT Noida · +91-7017744534
          </p>
        </div>
      </div>
    </section>
  )
}
