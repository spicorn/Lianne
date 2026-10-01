import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import gsap from 'gsap'
import { portraits } from '../portraits'
import { prefersReducedMotion } from '../motion'
import { publicFile } from '../publicFile'
import { Confetti } from './Confetti'

type PortraitProps = {
  theme: string
}

export function Portrait({ theme }: PortraitProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const first = useRef(true)
  const portrait = portraits[index]
  const reduced = prefersReducedMotion()

  useEffect(() => {
    portraits.forEach((item) => {
      const image = new Image()
      image.src = item.src
    })
  }, [])

  useEffect(() => {
    const image = imageRef.current
    if (!image) return
    if (first.current) {
      first.current = false
      return
    }
    if (prefersReducedMotion()) return
    gsap.fromTo(
      image,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out' },
    )
  }, [index])

  useEffect(() => {
    if (reduced || paused) return
    const call = gsap.delayedCall(5.5, () => {
      setIndex((current) => (current + 1) % portraits.length)
    })
    return () => {
      call.kill()
    }
  }, [index, paused, reduced])

  const go = (next: number) => {
    const count = portraits.length
    setIndex((next + count) % count)
  }

  return (
    <section
      className="section portrait"
      id="portraits"
      aria-roledescription="carousel"
      aria-label="Photographs of Lianne"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <p className="kicker" data-reveal>
        The reason I asked
      </p>
      <h2 className="section-title" data-reveal>
        You, in the light
      </h2>

      <div className="portrait__stage" data-reveal>
        <div className="hearts hearts-left" aria-hidden="true">
          <DotLottieReact
            src={publicFile('lottie/floating-hearts.json')}
            loop
            autoplay={!reduced}
            speed={0.45}
          />
        </div>
        <Confetti theme={theme} />
        <div className="frame">
          <img
            ref={imageRef}
            src={portrait.src}
            alt={portrait.alt}
          />
        </div>
      </div>

      <p className="portrait__caption" data-reveal aria-live="polite">
        {portrait.caption}
      </p>

      <div className="portrait__controls" data-reveal>
        <button
          type="button"
          className="icon-button"
          aria-label="Previous photograph"
          onClick={() => go(index - 1)}
        >
          <ChevronLeft className="icon" aria-hidden="true" />
        </button>
        <div className="thumbs" role="tablist" aria-label="Photographs">
          {portraits.map((item, itemIndex) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              className="thumb"
              aria-label={item.caption}
              aria-selected={itemIndex === index}
              onClick={() => go(itemIndex)}
            >
              <img src={item.src} alt="" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Next photograph"
          onClick={() => go(index + 1)}
        >
          <ChevronRight className="icon" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
