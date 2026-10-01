import { MessageCircle } from 'lucide-react'
import { prettyDate } from '../dates'
import type { Outing } from '../types'

type SealProps = {
  accepted: boolean
  outing: Outing | null
  date: string | null
}

const outingLabel: Record<Outing, string> = {
  picnic: 'A picnic',
  date: 'A date',
}

const outingLine: Record<Outing, string> = {
  picnic:
    'I will bring the blanket, and keep the spot beside me open until you sit down.',
  date: 'I will keep the afternoon slow, and the seat beside me open until you arrive.',
}

function whatsAppHref(accepted: boolean, outing: Outing | null, date: string | null) {
  const parts = [accepted ? 'Yes, I will' : 'Yes']
  if (outing) parts.push(outingLabel[outing])
  if (date) parts.push(prettyDate(date))
  const text = encodeURIComponent(parts.join(' · '))
  return `https://wa.me/27787828366?text=${text}`
}

export function Seal({ accepted, outing, date }: SealProps) {
  const ready = accepted && outing && date

  return (
    <section className="section seal-wrap" aria-labelledby="seal-title">
      <article className="seal" aria-live="polite">
        {ready ? (
          <>
            <p className="kicker" data-reveal>
              It is settled
            </p>
            <h2 id="seal-title" className="section-title" data-reveal>
              {prettyDate(date)}
            </h2>
            <p className="seal__kind" data-reveal>
              {outingLabel[outing]}
            </p>
            <p className="prose" data-reveal>
              {outingLine[outing]}
            </p>
            <p className="signoff" data-reveal>
              Yours
            </p>
          </>
        ) : (
          <>
            <p className="kicker" data-reveal>
              Waiting on you
            </p>
            <h2 id="seal-title" className="section-title" data-reveal>
              Our plan
            </h2>
            <p className="prose" data-reveal>
              Say yes, choose a picnic or a date, and pick the day. I will write
              it here.
            </p>
          </>
        )}
        <a
          className="whatsapp"
          data-reveal
          href={whatsAppHref(accepted, outing, date)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="icon icon-sm" aria-hidden="true" />
          WhatsApp
        </a>
      </article>
    </section>
  )
}
