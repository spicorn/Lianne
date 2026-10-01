import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../motion'

type RoseSplashProps = {
  onDone: () => void
}

type Bloom = {
  x: number
  y: number
  size: number
  rot: number
  spin: number
  drift: number
  delay: number
  color: string
}

function readSplashColors() {
  const styles = getComputedStyle(document.documentElement)
  return ['--splash-deep', '--splash-red', '--splash-pink', '--splash-blush']
    .map((token) => styles.getPropertyValue(token).trim())
    .filter(Boolean)
}

function drawRose(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string,
  center: string,
  open: number,
) {
  const scale = size * Math.min(1, open)
  context.save()
  context.translate(x, y)
  context.rotate(rotation)
  context.globalAlpha = Math.min(1, open)
  for (const ring of [1, 0.7, 0.42]) {
    context.save()
    const petals = ring > 0.8 ? 8 : 6
    for (let index = 0; index < petals; index += 1) {
      context.rotate((Math.PI * 2) / petals)
      context.beginPath()
      context.ellipse(
        scale * 0.2 * ring,
        0,
        scale * 0.36 * ring,
        scale * 0.22 * ring,
        0.6,
        0,
        Math.PI * 2,
      )
      context.fillStyle = color
      context.fill()
    }
    context.restore()
  }
  context.beginPath()
  context.arc(0, 0, scale * 0.12, 0, Math.PI * 2)
  context.fillStyle = center
  context.fill()
  context.restore()
}

export function RoseSplash({ onDone }: RoseSplashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reduced = prefersReducedMotion()
    const width = window.innerWidth
    const height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    const colors = readSplashColors()
    const center =
      getComputedStyle(document.documentElement).getPropertyValue('--splash-deep').trim() ||
      '#8e1638'
    const count = width < 700 ? 34 : 52
    const blooms: Bloom[] = Array.from({ length: count }, (_, index) => {
      const col = index % 6
      const row = Math.floor(index / 6)
      const cols = 6
      const rows = Math.ceil(count / cols)
      return {
        x: ((col + 0.5) / cols) * width + (Math.random() - 0.5) * (width / cols),
        y: ((row + 0.5) / rows) * height + (Math.random() - 0.5) * (height / rows),
        size: 36 + Math.random() * 78,
        rot: Math.random() * Math.PI,
        spin: -0.35 + Math.random() * 0.7,
        drift: -18 + Math.random() * 36,
        delay: Math.random() * 0.7,
        color: colors[index % colors.length] || '#d6254f',
      }
    })

    const paint = (time: number) => {
      context.clearRect(0, 0, width, height)
      const fade = time < 6.2 ? 0.98 : Math.max(0, 0.98 * (1 - (time - 6.2) / 1.2))
      context.fillStyle = `rgba(142, 22, 56, ${fade})`
      context.fillRect(0, 0, width, height)

      for (const bloom of blooms) {
        const open = reduced ? 1 : Math.min(1, Math.max(0, (time - bloom.delay) / 0.85))
        if (open <= 0) continue
        const travel = reduced ? 0 : Math.min(time, 6)
        drawRose(
          context,
          bloom.x,
          bloom.y + bloom.drift * travel * 0.15,
          bloom.size,
          bloom.rot + bloom.spin * travel,
          bloom.color,
          center,
          open * Math.min(1, fade / 0.98 || 0),
        )
      }
    }

    const clock = { time: 0 }
    paint(0)
    const tween = gsap.to(clock, {
      time: 7.4,
      duration: 7.4,
      ease: 'none',
      onUpdate: () => paint(clock.time),
      onComplete: () => onDoneRef.current(),
    })

    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div className="rose-splash" role="presentation" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
