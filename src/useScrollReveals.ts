import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveals(active: boolean, scope?: string) {
  useLayoutEffect(() => {
    if (!active || prefersReducedMotion()) return

    const root = scope ? document.querySelector(scope) : undefined
    if (scope && !root) return

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]', root ?? undefined).forEach((element) => {
        gsap.from(element, {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        })
      })
    })

    ScrollTrigger.refresh()

    return () => context.revert()
  }, [active, scope])
}
