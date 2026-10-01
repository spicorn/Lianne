import { Flower2, SunMedium } from 'lucide-react'
import type { Outing as OutingChoice } from '../types'

type OutingProps = {
  value: OutingChoice | null
  onChoose: (choice: OutingChoice) => void
}

export function Outing({ value, onChoose }: OutingProps) {
  return (
    <section className="section" id="outing" tabIndex={-1} aria-labelledby="outing-title">
      <p className="kicker" data-reveal>
        The shape of the day
      </p>
      <h2 id="outing-title" className="section-title" data-reveal>
        How should we spend it?
      </h2>
      <div className="outing">
        <button
          type="button"
          className="outing__choice"
          data-reveal
          data-look="picnic"
          aria-pressed={value === 'picnic'}
          onClick={() => onChoose('picnic')}
        >
          <SunMedium className="icon" aria-hidden="true" />
          <span className="outing__name">A picnic</span>
          <span className="outing__text">
            A blanket in the grass, something cold to drink and the afternoon
            in no hurry to end.
          </span>
          {value === 'picnic' ? <span className="outing__chosen">Chosen</span> : null}
        </button>
        <button
          type="button"
          className="outing__choice"
          data-reveal
          data-look="date"
          aria-pressed={value === 'date'}
          onClick={() => onChoose('date')}
        >
          <Flower2 className="icon" aria-hidden="true" />
          <span className="outing__name">A date</span>
          <span className="outing__text">
            Daylight, a table for two, and the afternoon with nowhere else to be.
          </span>
          {value === 'date' ? <span className="outing__chosen">Chosen</span> : null}
        </button>
      </div>
    </section>
  )
}
