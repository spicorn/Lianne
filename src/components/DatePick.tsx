import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addMonths,
  dateKey,
  monthLabel,
  prettyDate,
  startOfDay,
} from '../dates'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type DatePickProps = {
  value: string | null
  onChange: (value: string) => void
}

export function DatePick({ value, onChange }: DatePickProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const firstMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  )
  const lastMonth = useMemo(() => addMonths(firstMonth, 2), [firstMonth])
  const [cursor, setCursor] = useState(firstMonth)

  const startPad = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const atStart = cursor.getTime() <= firstMonth.getTime()
  const atEnd = cursor.getTime() >= lastMonth.getTime()

  return (
    <section className="section" id="day" aria-labelledby="day-title">
      <p className="kicker" data-reveal>
        The day itself
      </p>
      <h2 id="day-title" className="section-title" data-reveal>
        Choose our day
      </h2>
      <p className="prose" data-reveal>
        Any day from today onward. I will have it ready.
      </p>

      <div className="calendar-card" data-reveal>
        <div className="calendar-card__head">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous month"
            disabled={atStart}
            onClick={() => setCursor((current) => addMonths(current, -1))}
          >
            <ChevronLeft className="icon" aria-hidden="true" />
          </button>
          <p className="calendar-card__month">{monthLabel(cursor)}</p>
          <button
            type="button"
            className="icon-button"
            aria-label="Next month"
            disabled={atEnd}
            onClick={() => setCursor((current) => addMonths(current, 1))}
          >
            <ChevronRight className="icon" aria-hidden="true" />
          </button>
        </div>

        <div className="calendar" aria-label={monthLabel(cursor)}>
          {WEEKDAYS.map((day) => (
            <span key={day} className="calendar__weekday">
              {day}
            </span>
          ))}
          {Array.from({ length: startPad }, (_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1
            const date = new Date(cursor.getFullYear(), cursor.getMonth(), day)
            const key = dateKey(date)
            const disabled = date < today
            const isToday = key === dateKey(today)

            return (
              <button
                key={key}
                type="button"
                className={isToday ? 'day is-today' : 'day'}
                disabled={disabled}
                aria-pressed={value === key}
                aria-label={prettyDate(key)}
                onClick={() => onChange(key)}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      <p className="date-note" data-reveal aria-live="polite">
        {value ? prettyDate(value) : 'No day chosen yet.'}
      </p>
    </section>
  )
}
