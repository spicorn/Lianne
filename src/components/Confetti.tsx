import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../motion'

type Bit = {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  rot: number
  vr: number
  color: string
  heart: boolean
}

type ConfettiProps = {
  theme: string
}

function readColors() {
  const styles = getComputedStyle(document.documentElement)
  return ['--rose', '--gold', '--blush', '--leaf'].map((token) =>
    styles.getPropertyValue(token).trim(),
  )
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.beginPath()
  ctx.moveTo(x, y + size * 0.3)
  ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.35)
  ctx.bezierCurveTo(x - size, y + size * 0.75, x, y + size, x, y + size * 1.2)
  ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.75, x + size, y + size * 0.35)
  ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3)
  ctx.fill()
}

export function Confetti({ theme }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !parent || !context) return

    const reduced = prefersReducedMotion()
    const colors = readColors().filter(Boolean)
    const bits: Bit[] = []
    let last = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = parent.clientWidth * dpr
      canvas.height = parent.clientHeight * dpr
      canvas.style.width = `${parent.clientWidth}px`
      canvas.style.height = `${parent.clientHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      bits.length = 0
      const count = width < 700 ? 22 : 34
      for (let index = 0; index < count; index += 1) {
        const edge = index % 4
        let x = Math.random() * width
        let y = Math.random() * height
        if (edge === 0) y = Math.random() * height * 0.28
        if (edge === 1) x = width * (0.72 + Math.random() * 0.28)
        if (edge === 2) x = Math.random() * width * 0.28
        if (edge === 3) y = height * (0.72 + Math.random() * 0.28)
        bits.push({
          x,
          y,
          size: 5 + Math.random() * 7,
          vx: -18 + Math.random() * 36,
          vy: 28 + Math.random() * 46,
          rot: Math.random() * Math.PI,
          vr: -1.2 + Math.random() * 2.4,
          color: colors[index % colors.length] || '#c44b6a',
          heart: index % 2 === 0,
        })
      }
    }

    const paint = (time?: number) => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      const delta = time == null || last === 0 ? 0 : Math.min(0.05, time - last)
      if (time != null) last = time
      context.clearRect(0, 0, width, height)

      for (const bit of bits) {
        if (!reduced && delta > 0) {
          bit.x += bit.vx * delta
          bit.y += bit.vy * delta
          bit.rot += bit.vr * delta
          if (bit.y > height + 16) {
            bit.y = -16
            bit.x = Math.random() * width
          }
          if (bit.x < -16) bit.x = width + 16
          if (bit.x > width + 16) bit.x = -16
        }

        context.save()
        context.translate(bit.x, bit.y)
        context.rotate(bit.rot)
        context.globalAlpha = 0.88
        context.fillStyle = bit.color
        if (bit.heart) {
          drawHeart(context, 0, 0, bit.size)
        } else {
          context.fillRect(-bit.size / 2, -bit.size * 0.2, bit.size, bit.size * 0.45)
        }
        context.restore()
      }
    }

    resize()
    seed()
    paint()

    const onResize = () => {
      resize()
      seed()
      paint()
    }
    window.addEventListener('resize', onResize)

    if (!reduced) gsap.ticker.add(paint)

    return () => {
      window.removeEventListener('resize', onResize)
      if (!reduced) gsap.ticker.remove(paint)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
}
