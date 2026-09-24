import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { portfolioProjects } from '../data/portfolioProjects'
import { cn } from '../lib/utils'

// How each logo sits in the strip. `size` evens out the padding baked into
// the source files; `plate` is the card that appears behind the full-colour
// logo on hover: light for dark artwork, dark for light or gold artwork.
const LOGO_STYLE = {
  'brahma-sutras': { size: 1, plate: 'dark', label: 'Wellness venues' },
  'atma-shambhala': { size: 1.7, plate: 'dark', label: 'Spiritual platform' },
  'loyalty-club-plc': { size: 1, plate: 'light', label: 'Loyalty platform' },
  'inner-sphere': { size: 1, plate: 'dark', label: 'Wellbeing app' },
  awakenest: { size: 1, plate: 'light', label: 'Festival' },
}
const additionalClients = [
  { name: 'Shoptimized', logo: '/images/logos/shoptimized.png', slug: null, size: 0.75, plate: 'light', label: 'E-commerce' },
]

const portfolioLogos = portfolioProjects
  .filter((p) => p.logo)
  .map((p) => ({ name: p.name, logo: p.logo, slug: p.slug, size: 1, plate: 'light', label: '', ...LOGO_STYLE[p.slug] }))
const midpoint = Math.ceil(portfolioLogos.length / 2)
const LOGOS = [...portfolioLogos.slice(0, midpoint), ...additionalClients, ...portfolioLogos.slice(midpoint)]

// Three copies so the loop never shows a gap, even on very wide screens.
// Only the first copy is exposed to assistive tech and the keyboard, and
// only the first is in the server HTML (the rest are added after mount), to
// keep the document inside the first round trip.
const COPIES = 3
const SPEED = 36 // px/s at rest
const DRAG_THRESHOLD = 6

const LogoCard = ({ item, hidden }) => {
  const light = item.plate === 'light'
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 scale-[0.92] rounded-2xl opacity-0 transition-[opacity,transform] duration-500 ease-smooth group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100',
          light
            ? 'bg-white shadow-[0_18px_50px_-18px_rgba(129,140,248,0.75)]'
            : 'bg-[#0e1233] shadow-[0_18px_50px_-18px_rgba(99,102,241,0.8)] ring-1 ring-inset ring-indigo-300/20'
        )}
      />
      {/* The wrapper scales logos whose artwork carries extra padding. */}
      <span className="relative flex items-center justify-center" style={{ transform: `scale(${item.size})` }}>
        <Image
          src={item.logo}
          alt={hidden ? '' : item.name}
          width={400}
          height={120}
          sizes="(max-width: 767px) 200px, 300px"
          draggable={false}
          className="trusted-logo relative w-auto opacity-60 transition-[filter,opacity,transform] duration-500 ease-smooth [filter:brightness(0)_invert(1)] group-hover:-translate-y-2 group-hover:opacity-100 group-hover:[filter:none] group-focus-visible:-translate-y-2 group-focus-visible:opacity-100 group-focus-visible:[filter:none]"
        />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-3 flex translate-y-1 items-center justify-center gap-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] opacity-0 transition-[opacity,transform] duration-500 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-md:hidden',
          light ? 'text-slate-500' : 'text-indigo-200/75'
        )}
      >
        {item.label}
        {item.slug && (
          <>
            <span className="opacity-50">·</span> Case study <ArrowUpRight className="h-3 w-3" />
          </>
        )}
      </span>
    </>
  )
  const cardClass =
    'group relative flex h-[120px] w-full items-center justify-center rounded-2xl outline-none max-md:h-[84px]'
  if (!item.slug) return <div className={cardClass}>{inner}</div>
  return (
    <Link
      href={`/work/${item.slug}`}
      tabIndex={hidden ? -1 : undefined}
      aria-label={hidden ? undefined : `${item.name} case study`}
      className={cn(cardClass, 'focus-visible:ring-2 focus-visible:ring-indigo-400/70')}
    >
      {inner}
    </Link>
  )
}

const TrustedBy = () => {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [copies, setCopies] = useState(1)

  useEffect(() => setCopies(COPIES), [])

  // The strip drifts on its own, eases to a stop under the pointer or
  // keyboard focus, can be dragged or flung (mouse, touch, trackpad), and
  // picks up a little momentum from page scrolling. Logos near the centre
  // come forward; those near the edges recede.
  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || copies < COPIES) return undefined
    const items = Array.from(track.children)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const base = reduced ? 0 : SPEED

    let viewW = 0
    let setW = 1
    let centres = []
    const measure = () => {
      viewW = viewport.clientWidth
      setW = track.scrollWidth / COPIES || 1
      centres = items.map((el) => el.offsetLeft + el.offsetWidth / 2)
    }

    let x = 0
    let v = base
    let seek = null
    let hovering = false
    let focused = false
    let raf = 0
    let last = 0
    let scrollY = window.scrollY
    const drag = { active: false, id: -1, lastX: 0, lastT: 0, moved: 0, vel: 0, captured: false }

    const wrap = (n) => ((n % setW) + setW) % setW

    const apply = () => {
      const off = wrap(x)
      track.style.transform = `translate3d(${-off.toFixed(2)}px, 0, 0)`
      const half = viewW / 2 || 1
      for (let i = 0; i < items.length; i++) {
        const t = Math.min(1, Math.abs(centres[i] - off - half) / half)
        items[i].style.setProperty('--f', (1 - t * t).toFixed(3))
      }
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now

      const sy = window.scrollY
      if (!reduced && !drag.active) v = Math.max(-1200, Math.min(1200, v + (sy - scrollY) * 0.5))
      scrollY = sy

      if (seek !== null) {
        x += (seek - x) * Math.min(1, dt * 7)
        if (Math.abs(seek - x) < 0.5) seek = null
        v = 0
      } else if (!drag.active) {
        const target = hovering || focused ? 0 : base
        const settle = Math.abs(v) > base * 1.5 ? 1.8 : 3.2
        v += (target - v) * Math.min(1, dt * settle)
        x += v * dt
      }
      apply()
    }

    const start = () => {
      if (!raf) {
        last = 0
        scrollY = window.scrollY
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onEnter = (e) => {
      if (e.pointerType === 'mouse') hovering = true
    }
    const onLeave = (e) => {
      if (e.pointerType === 'mouse') hovering = false
    }
    const onDown = (e) => {
      if (e.button !== 0) return
      drag.active = true
      drag.id = e.pointerId
      drag.lastX = e.clientX
      drag.lastT = e.timeStamp
      drag.moved = 0
      drag.vel = 0
      drag.captured = false
      seek = null
    }
    const onMove = (e) => {
      if (!drag.active || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.lastX
      const dtMs = Math.max(1, e.timeStamp - drag.lastT)
      drag.moved += Math.abs(dx)
      drag.vel = drag.vel * 0.6 + ((-dx / dtMs) * 1000) * 0.4
      drag.lastX = e.clientX
      drag.lastT = e.timeStamp
      x -= dx
      if (!drag.captured && drag.moved > DRAG_THRESHOLD) {
        drag.captured = true
        viewport.setPointerCapture(e.pointerId)
        viewport.dataset.dragging = 'true'
      }
    }
    const onUp = (e) => {
      if (!drag.active || e.pointerId !== drag.id) return
      drag.active = false
      if (drag.captured) {
        // A fling keeps going and eases back to the resting drift.
        if (e.timeStamp - drag.lastT < 80) v = Math.max(-2400, Math.min(2400, drag.vel))
        else v = 0
        if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId)
      }
      delete viewport.dataset.dragging
    }
    // A drag that ends over a logo must not also open its case study.
    const onClickCapture = (e) => {
      if (drag.moved > DRAG_THRESHOLD) {
        e.preventDefault()
        e.stopPropagation()
        drag.moved = 0
      }
    }
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      seek = null
      x += e.deltaX
      v = 0
    }
    // Keyboard focus: pause and bring the focused logo toward the centre.
    const onFocusIn = (e) => {
      focused = true
      viewport.scrollLeft = 0
      const li = e.target.closest('li')
      const i = items.indexOf(li)
      if (i >= 0) seek = x - wrap(x) + Math.max(0, Math.min(setW - 1, centres[i] - viewW / 2))
    }
    const onFocusOut = (e) => {
      if (!viewport.contains(e.relatedTarget)) focused = false
    }
    // Focusing a clipped link can scroll an overflow-hidden box; the
    // transform does the scrolling here, so undo it.
    const onScroll = () => {
      viewport.scrollLeft = 0
    }

    measure()
    apply()
    const ro = new ResizeObserver(() => {
      measure()
      apply()
    })
    ro.observe(viewport)
    ro.observe(track)
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(viewport)

    viewport.addEventListener('pointerenter', onEnter)
    viewport.addEventListener('pointerleave', onLeave)
    viewport.addEventListener('pointerdown', onDown)
    viewport.addEventListener('pointermove', onMove)
    viewport.addEventListener('pointerup', onUp)
    viewport.addEventListener('pointercancel', onUp)
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('focusout', onFocusOut)
    viewport.addEventListener('scroll', onScroll)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      viewport.removeEventListener('pointerenter', onEnter)
      viewport.removeEventListener('pointerleave', onLeave)
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('focusout', onFocusOut)
      viewport.removeEventListener('scroll', onScroll)
    }
  }, [copies])

  return (
    <section className="trusted relative overflow-hidden border-b border-white/[0.06] bg-[#06070f] pb-14 pt-12 max-md:pb-8 max-md:pt-8">
      {/* Horizon hairline and glow carried down from the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.14),transparent_70%)]"
      />

      <p className="relative mb-8 flex items-center justify-center gap-4 text-center font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/50 max-md:mb-5 max-md:px-4 max-md:text-[0.625rem] max-md:tracking-[0.1em]">
        <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-300/40 max-md:hidden" />
        Trusted by teams building remarkable products
        <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-300/40 max-md:hidden" />
      </p>

      <div
        ref={viewportRef}
        className="trusted-viewport relative cursor-grab touch-pan-y select-none overflow-hidden"
        aria-label="Clients"
        role="region"
      >
        <ul ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: copies }, (_, copy) =>
            LOGOS.map((item) => (
              <li
                key={`${copy}-${item.name}`}
                aria-hidden={copy > 0 ? 'true' : undefined}
                className="trusted-item w-[clamp(210px,21vw,290px)] shrink-0 px-3 max-md:w-[46vw] max-md:px-1.5"
              >
                <LogoCard item={item} hidden={copy > 0} />
              </li>
            ))
          )}
        </ul>
      </div>

      <style jsx>{`
        .trusted-viewport {
          -webkit-mask-image: linear-gradient(to right, transparent, #000 14%, #000 86%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 14%, #000 86%, transparent);
        }
        .trusted-viewport[data-dragging] {
          cursor: grabbing;
        }
        .trusted-item {
          --h: 0;
          opacity: calc(0.35 + 0.65 * max(var(--f, 1), var(--h)));
          transform: scale(calc(0.9 + 0.1 * var(--f, 1)));
          transition: opacity 0.35s ease-out;
        }
        .trusted-item:hover,
        .trusted-item:focus-within {
          --h: 1;
        }
        .trusted-item :global(.trusted-logo) {
          height: 64px;
          max-width: 100%;
          object-fit: contain;
        }
        @media (max-width: 767px) {
          .trusted-item :global(.trusted-logo) {
            height: 40px;
          }
        }
      `}</style>
    </section>
  )
}

export default TrustedBy
