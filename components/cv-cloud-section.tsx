'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WORDS: { text: string; size: 'lg' | 'md' | 'sm'; tone: 'primary' | 'accent' | 'muted' }[] = [
  { text: 'Full-Stack', size: 'lg', tone: 'primary' },
  { text: 'DSA', size: 'md', tone: 'accent' },
  { text: 'React', size: 'lg', tone: 'muted' },
  { text: 'Next.js', size: 'md', tone: 'primary' },
  { text: 'Problem Solver', size: 'lg', tone: 'accent' },
  { text: 'LeetCode Knight', size: 'md', tone: 'primary' },
  { text: 'REST APIs', size: 'sm', tone: 'muted' },
  { text: 'CI/CD', size: 'sm', tone: 'accent' },
  { text: 'MongoDB', size: 'md', tone: 'muted' },
  { text: 'PostgreSQL', size: 'sm', tone: 'primary' },
  { text: 'AWS', size: 'md', tone: 'accent' },
  { text: 'Docker', size: 'sm', tone: 'muted' },
  { text: 'TypeScript', size: 'lg', tone: 'primary' },
  { text: 'Ownership', size: 'md', tone: 'accent' },
  { text: 'Builder', size: 'lg', tone: 'muted' },
  { text: 'Hackathons', size: 'md', tone: 'primary' },
  { text: 'System Design', size: 'sm', tone: 'accent' },
  { text: 'Mathematics', size: 'md', tone: 'muted' },
  { text: 'Early Starter', size: 'sm', tone: 'primary' },
  { text: 'JIIT Noida', size: 'md', tone: 'accent' },
  { text: 'Always Shipping', size: 'sm', tone: 'muted' },
  { text: 'Node.js', size: 'md', tone: 'primary' },
  { text: 'ML Basics', size: 'sm', tone: 'accent' },
  { text: 'Git/GitHub', size: 'sm', tone: 'muted' },
  { text: 'Chegg SME', size: 'sm', tone: 'primary' },
  { text: 'Agile', size: 'sm', tone: 'accent' },
  { text: 'Analytics', size: 'sm', tone: 'muted' },
  { text: 'Curiosity', size: 'md', tone: 'accent' },
]

const sizeClass = {
  lg: 'text-3xl md:text-5xl',
  md: 'text-xl md:text-3xl',
  sm: 'text-sm md:text-lg',
}

const toneClass = {
  primary: 'text-primary',
  accent: 'text-accent',
  muted: 'text-muted-foreground',
}

export function CvCloudSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cv-word',
        { scale: 0, opacity: 0, rotate: () => gsap.utils.random(-20, 20) },
        {
          scale: 1,
          opacity: 1,
          rotate: () => gsap.utils.random(-4, 4),
          stagger: { each: 0.04, from: 'random' },
          duration: 0.7,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative border-b border-border px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-4xl text-foreground md:text-6xl">
          My CV, in about <span className="text-accent">30 words</span>
        </h2>
        <div className="mt-12 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-4">
          {WORDS.map((w, i) => (
            <span
              key={i}
              className={`cv-word font-display inline-block cursor-default transition-transform hover:scale-110 ${sizeClass[w.size]} ${toneClass[w.tone]}`}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
