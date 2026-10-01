import { useLayoutEffect, useRef, type PointerEvent } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../motion'

type LetterProps = {
  accepted: boolean
  onAccept: () => void
}

export function Letter({ accepted, onAccept }: LetterProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const fleeing = useRef(false)

  const flee = (clientX?: number, clientY?: number) => {
    if (fleeing.current) return
    const stage = stageRef.current
    const button = noRef.current
    if (!stage || !button) return

    fleeing.current = true
    const pad = 10
    const maxX = Math.max(pad, stage.clientWidth - button.offsetWidth - pad)
    const maxY = Math.max(pad, stage.clientHeight - button.offsetHeight - pad)
    const stageRect = stage.getBoundingClientRect()
    const currentX = Number(gsap.getProperty(button, 'x')) || 0
    const currentY = Number(gsap.getProperty(button, 'y')) || 0
    const corners = [
      { x: pad, y: pad },
      { x: maxX, y: pad },
      { x: pad, y: maxY },
      { x: maxX, y: maxY },
    ]

    let best = corners[0]
    let bestScore = -1
    for (const corner of corners) {
      const centerX = stageRect.left + corner.x + button.offsetWidth / 2
      const centerY = stageRect.top + corner.y + button.offsetHeight / 2
      const fromPointer =
        clientX == null || clientY == null
          ? 0
          : Math.hypot(centerX - clientX, centerY - clientY)
      const fromCurrent = Math.hypot(corner.x - currentX, corner.y - currentY)
      const score = fromPointer * 2 + fromCurrent
      if (score > bestScore) {
        bestScore = score
        best = corner
      }
    }

    gsap.to(button, {
      x: best.x,
      y: best.y,
      duration: prefersReducedMotion() ? 0 : 0.34,
      ease: 'power3.out',
      overwrite: 'auto',
      onComplete: () => {
        fleeing.current = false
      },
    })
  }

  useLayoutEffect(() => {
    const stage = stageRef.current
    const button = noRef.current
    if (!stage || !button) return
    const pad = 10
    gsap.set(button, {
      x: Math.max(pad, stage.clientWidth - button.offsetWidth - pad),
      y: 18,
    })

    const onResize = () => {
      const maxX = Math.max(pad, stage.clientWidth - button.offsetWidth - pad)
      const maxY = Math.max(pad, stage.clientHeight - button.offsetHeight - pad)
      const x = Math.min(Number(gsap.getProperty(button, 'x')) || 0, maxX)
      const y = Math.min(Number(gsap.getProperty(button, 'y')) || 0, maxY)
      gsap.set(button, { x, y })
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onStageMove = (event: PointerEvent<HTMLDivElement>) => {
    const button = noRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const distance = Math.hypot(
      event.clientX - (rect.left + rect.width / 2),
      event.clientY - (rect.top + rect.height / 2),
    )
    if (distance < 118) flee(event.clientX, event.clientY)
  }

  return (
    <section className="letter">
      <p className="kicker" data-reveal>
        Written for you
      </p>
      <h1 id="greeting" className="greeting" tabIndex={-1} data-reveal>
        Lianne,
      </h1>
      <p className="lead" data-reveal>
        There is a kind of afternoon I keep picturing with you already in it.
      </p>
      <p className="prose" data-reveal>
        Not a loud room. Not a clock to watch. Just you, close by and a little
        time I set aside because you are the part of my week I look forward to.
      </p>
      <p className="prose" data-reveal>
        I would like to take you out. Sweetly and properly.
      </p>
      <p className="ask-line" data-reveal>
        Will you come with me?
      </p>

      <div className="ask" data-reveal>
        <button type="button" className="yes" onClick={onAccept} disabled={accepted}>
          {accepted ? 'You said yes' : 'Yes, I will'}
        </button>
        <div
          className="no-stage"
          ref={stageRef}
          onPointerMove={onStageMove}
        >
          <button
            type="button"
            className="no"
            ref={noRef}
            aria-describedby="no-hint"
            onPointerEnter={(event) => flee(event.clientX, event.clientY)}
            onPointerDown={(event) => {
              event.preventDefault()
              flee(event.clientX, event.clientY)
            }}
            onClick={(event) => {
              event.preventDefault()
              flee(event.clientX, event.clientY)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                flee()
              }
            }}
          >
            No
          </button>
        </div>
      </div>

      {accepted ? (
        <p className="yes-note">Then let me make the day ours.</p>
      ) : null}

      <p className="signoff" data-reveal>
        Yours Suspect
      </p>
    </section>
  )
}
