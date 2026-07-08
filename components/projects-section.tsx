'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Project = {
  index: string
  name: string
  role: string
  org: string
  stack: string
  duration: string
  bullets: string[]
  stats: { value: string; label: string }[]
}

const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'IBM SkillsBuild',
    role: 'Artificial Intelligence Intern',
    org: 'Industry mentorship program',
    stack: 'Python · ML · Supervised Learning',
    duration: 'May – Jun 2025',
    bullets: [
      'Built and evaluated ML models in Python — data preprocessing, feature engineering, and model evaluation across supervised learning use cases.',
      'Delivered a capstone project translating an AI concept into a working prototype under industry mentorship.',
    ],
    stats: [
      { value: 'ML', label: 'models built & evaluated' },
      { value: '1', label: 'capstone prototype shipped' },
      { value: '8', label: 'weeks of mentorship' },
    ],
  },
  {
    index: '02',
    name: 'Chegg India',
    role: 'Subject Matter Expert (CS & Mathematics)',
    org: 'Remote · EdTech',
    stack: 'CS · Mathematics · Problem Solving',
    duration: 'Aug 2024 – Present',
    bullets: [
      'Authored expert solutions to 500+ computer science and mathematics problems with a 95% accuracy rating.',
      'Created reusable solution templates that cut average response time by 30% while raising content-quality scores 20%.',
    ],
    stats: [
      { value: '500+', label: 'problems solved' },
      { value: '95%', label: 'accuracy rating' },
      { value: '30%', label: 'faster response time' },
    ],
  },
  {
    index: '03',
    name: 'Budget Mitra',
    role: 'Price Comparison Platform',
    org: 'Personal project · Live users',
    stack: 'React.js · Node.js · MongoDB',
    duration: 'Full-stack build',
    bullets: [
      'Built a full-stack platform that scrapes and aggregates real-time prices from Amazon and Flipkart across 1,000+ products, with a price-history tracker helping users save up to 25% per purchase.',
      'Optimized the scraping pipeline with caching and parallel requests, reducing average page-load time from 3.2s to under 800ms.',
    ],
    stats: [
      { value: '1,000+', label: 'products tracked' },
      { value: '25%', label: 'savings per purchase' },
      { value: '800ms', label: 'page load (from 3.2s)' },
    ],
  },
  {
    index: '04',
    name: 'Pet Rescue System',
    role: 'Adoption & Rescue App',
    org: 'Hackathon finalist · 100+ teams',
    stack: 'Next.js · TypeScript · Node.js · MongoDB',
    duration: 'Full-stack build',
    bullets: [
      'Engineered real-time reporting of animals in distress with geolocation-based matching to nearby shelters, cutting average shelter response time by ~40% in pilot usage.',
      'Designed 15+ REST API endpoints with JWT authentication and role-based access for users, shelters, and admins.',
    ],
    stats: [
      { value: '40%', label: 'faster shelter response' },
      { value: '15+', label: 'REST API endpoints' },
      { value: '3', label: 'user roles (JWT + RBAC)' },
    ],
  },
  {
    index: '05',
    name: 'Resume ATS Generator',
    role: 'Resume Optimization Tool',
    org: 'Personal project',
    stack: 'React.js · Node.js · NLP · LaTeX',
    duration: 'Full-stack build',
    bullets: [
      'Automated resume tailoring against job descriptions using keyword analysis, improving ATS compatibility scores by up to 40%.',
    ],
    stats: [
      { value: '40%', label: 'better ATS scores' },
      { value: 'NLP', label: 'keyword analysis engine' },
      { value: 'LaTeX', label: 'pixel-perfect output' },
    ],
  },
]

export function ProjectsSection() {
  const rootRef = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: (i % 2) * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      id="projects"
      className="relative border-b border-border px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          {'03 — The Work That Started It All'}
        </p>
        <h2 className="font-display mt-4 text-5xl text-foreground md:text-7xl">
          Projects &amp; <span className="text-primary">Internships</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Cards expand on click — the work stands out without extra visual noise competing for
          attention.
        </p>

        <div className="mt-14 flex flex-col gap-6">
          {PROJECTS.map((project, i) => {
            const isOpen = openIndex === i
            return (
              <article key={project.index} className="project-card">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`group w-full rounded-xl border p-6 text-left transition-all md:p-8 ${
                    isOpen
                      ? 'border-primary bg-card shadow-[0_0_40px_rgba(59,130,246,0.2)]'
                      : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card'
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-xl text-accent">{project.index}</span>
                      <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-primary md:text-4xl">
                        {project.name}
                      </h3>
                    </div>
                    <span
                      className={`font-display text-2xl transition-transform ${isOpen ? 'rotate-45 text-primary' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground/80">{project.role}</span>
                    <span>·</span>
                    <span>{project.org}</span>
                    <span>·</span>
                    <span className="text-primary">{project.stack}</span>
                  </div>

                  <div
                    className={`grid transition-all duration-500 ease-out ${isOpen ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-3">
                        {project.bullets.map((b, bi) => (
                          <li key={bi} className="flex gap-3 text-pretty text-sm leading-relaxed text-card-foreground md:text-base">
                            <span className="text-accent" aria-hidden="true">→</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {project.stats.map((s, si) => (
                          <div
                            key={si}
                            className="rounded-lg border border-border bg-background p-4"
                          >
                            <p className="font-display text-2xl text-accent md:text-3xl">
                              {s.value}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                        {project.duration}
                      </p>
                    </div>
                  </div>
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
