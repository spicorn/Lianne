import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      anchors: true,
      allowNestedScroll: true,
    })

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
    lenisRef.current = lenis

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (enabled) lenis.start()
    else lenis.stop()
  }, [enabled])

  return useCallback((target: string) => {
    const reduced = prefersReducedMotion()
    const lenis = lenisRef.current
    const focusTarget = () => {
      document.getElementById('outing')?.focus({ preventScroll: true })
    }

    if (!lenis) {
      document.querySelector(target)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
      focusTarget()
      return
    }

    lenis.scrollTo(target, {
      offset: -8,
      duration: reduced ? 0 : 1.15,
      immediate: reduced,
      onComplete: focusTarget,
    })
  }, [])
}
