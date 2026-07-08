'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function BestWorkSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big stat counters
      gsap.utils.toArray<HTMLElement>('.bw-counter').forEach((el) => {
        const target = Number(el.dataset.target || '0')
        const suffix = el.dataset.suffix || ''
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.bw-block').forEach((block, i) => {
        gsap.fromTo(
          block,
          { y: 90, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: (i % 3) * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 88%' },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      id="best-work"
      className="grain relative overflow-hidden border-b border-border px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          {"04 — Work I'm Most Proud Of"}
        </p>
        <h2 className="font-display mt-4 text-5xl text-foreground md:text-7xl">
          Best <span className="text-primary">Work</span>
        </h2>

        {/* Headline stats strip */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { target: 3, suffix: '+', label: 'Production apps shipped', sub: 'serving live users' },
            { target: 300, suffix: '+', label: 'LeetCode problems', sub: 'Knight — top ~5% of 5M+' },
            { target: 500, suffix: '+', label: 'Expert solutions', sub: '95% accuracy at Chegg' },
            { target: 40, suffix: '%', label: 'Response time cut', sub: 'Pet Rescue pilot usage' },
          ].map((stat, i) => (
            <div key={i} className="bw-block rounded-xl border border-border bg-card p-6">
              <p
                className="bw-counter font-display text-5xl text-accent md:text-6xl"
                data-target={stat.target}
                data-suffix={stat.suffix}
              >
                0
              </p>
              <p className="mt-2 font-bold text-card-foreground">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Case study 1: Budget Mitra */}
        <article className="bw-block mt-16 rounded-2xl border border-primary/40 bg-card p-8 md:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              CASE STUDY 1
            </span>
            <span className="text-sm text-muted-foreground">React.js · Node.js · MongoDB</span>
          </div>
          <h3 className="font-display mt-4 text-3xl text-foreground md:text-5xl">
            Budget Mitra — turning price chaos into 25% savings
          </h3>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-display text-sm tracking-widest text-accent">PROBLEM</p>
              <p className="mt-2 text-pretty leading-relaxed text-card-foreground">
                Prices for the same product swing wildly between Amazon and Flipkart. Shoppers had
                no way to know if today&apos;s &quot;deal&quot; was actually a markup — the data
                existed, the visibility didn&apos;t.
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <li>- No cross-platform price comparison</li>
                <li>- Zero price history awareness</li>
                <li>- Slow, unscalable manual checking</li>
              </ul>
            </div>
            <div>
              <p className="font-display text-sm tracking-widest text-accent">STRATEGY</p>
              <ol className="mt-2 flex flex-col gap-4">
                <li className="flex gap-3">
                  <span className="font-display text-primary">01</span>
                  <p className="text-sm leading-relaxed text-card-foreground">
                    <span className="font-bold">SCRAPING ENGINE</span> — real-time aggregation
                    across 1,000+ products from Amazon and Flipkart.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="font-display text-primary">02</span>
                  <p className="text-sm leading-relaxed text-card-foreground">
                    <span className="font-bold">HISTORY TRACKER</span> — price-history graphs turn
                    guessing into informed buying.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="font-display text-primary">03</span>
                  <p className="text-sm leading-relaxed text-card-foreground">
                    <span className="font-bold">SPEED PIPELINE</span> — caching + parallel requests
                    took page loads from 3.2s to under 800ms.
                  </p>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <p className="font-display text-3xl text-accent">1,000+</p>
              <p className="text-sm text-muted-foreground">products tracked live</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent">25%</p>
              <p className="text-sm text-muted-foreground">avg. savings per purchase</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent">4x</p>
              <p className="text-sm text-muted-foreground">faster page loads</p>
            </div>
          </div>
        </article>

        {/* Case study 2: Pet Rescue */}
        <article className="bw-block mt-10 rounded-2xl border border-accent/40 bg-card p-8 md:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              CASE STUDY 2
            </span>
            <span className="text-sm text-muted-foreground">
              Next.js · TypeScript · Node.js · MongoDB
            </span>
          </div>
          <h3 className="font-display mt-4 text-3xl text-foreground md:text-5xl">
            Pet Rescue System — 40% faster rescues, hackathon finalist
          </h3>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-display text-sm tracking-widest text-accent">THE FEAR</p>
              <p className="mt-2 text-pretty leading-relaxed text-card-foreground">
                {'"An animal is in distress right now — but which shelter is closest, and will they even see the report in time?" Rescue was slow, manual, and location-blind.'}
              </p>
            </div>
            <div>
              <p className="font-display text-sm tracking-widest text-accent">OUR ANSWER</p>
              <p className="mt-2 text-pretty leading-relaxed text-card-foreground">
                Real-time distress reporting with geolocation-based matching that routes every
                report straight to the nearest shelter — plus 15+ REST endpoints with JWT auth and
                role-based access for users, shelters, and admins.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <p className="font-display text-3xl text-accent">~40%</p>
              <p className="text-sm text-muted-foreground">faster shelter response in pilot</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent">15+</p>
              <p className="text-sm text-muted-foreground">secured REST API endpoints</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent">Top 1%</p>
              <p className="text-sm text-muted-foreground">finalist among 100+ teams</p>
            </div>
          </div>
        </article>

        {/* Case study 3: Resume ATS */}
        <article className="bw-block mt-10 rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
              CASE STUDY 3
            </span>
            <span className="text-sm text-muted-foreground">React.js · Node.js · NLP · LaTeX</span>
          </div>
          <h3 className="font-display mt-4 text-3xl text-foreground md:text-5xl">
            Resume ATS Generator — beating the bots at their own game
          </h3>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-card-foreground">
            Automated resume tailoring against any job description using NLP keyword analysis,
            improving ATS compatibility scores by up to 40% — with clean LaTeX output that looks
            as good to humans as it scores with machines.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <p className="font-display text-3xl text-accent">+40%</p>
              <p className="text-sm text-muted-foreground">ATS compatibility lift</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent">JD → CV</p>
              <p className="text-sm text-muted-foreground">automated keyword tailoring</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
