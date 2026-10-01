import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Cover } from './components/Cover'
import { DatePick } from './components/DatePick'
import { Letter } from './components/Letter'
import { MusicButton } from './components/MusicButton'
import { Outing } from './components/Outing'
import { Portrait } from './components/Portrait'
import { RoseSplash } from './components/RoseSplash'
import { Seal } from './components/Seal'
import { prefersReducedMotion } from './motion'
import { publicFile } from './publicFile'
import type { Outing as OutingChoice } from './types'
import { useScrollReveals } from './useScrollReveals'
import { useSmoothScroll } from './useSmoothScroll'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const washRef = useRef<HTMLDivElement>(null)
  const opening = useRef(false)
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [splashing, setSplashing] = useState(false)
  const [outing, setOuting] = useState<OutingChoice | null>(null)
  const [date, setDate] = useState<string | null>(null)

  const scrollToPlan = useSmoothScroll(opened)
  useScrollReveals(opened)
  useScrollReveals(accepted, '#after-yes')

  const startSong = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0
    void audio
      .play()
      .then(() => {
        setPlaying(true)
        if (prefersReducedMotion()) {
          audio.volume = 0.4
          return
        }
        gsap.to(audio, { volume: 0.4, duration: 1.4, ease: 'power1.out' })
      })
      .catch(() => {
        setPlaying(false)
      })
  }

  const toggleSong = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
      return
    }
    audio.pause()
    setPlaying(false)
  }

  const openInvitation = () => {
    if (opening.current) return
    opening.current = true
    startSong()

    const finish = () => {
      setOpened(true)
      window.setTimeout(() => {
        document.getElementById('greeting')?.focus()
      }, 0)
    }

    if (prefersReducedMotion()) {
      finish()
      return
    }

    gsap
      .timeline({ onComplete: finish })
      .to('.cover__card', {
        y: -28,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
      })
      .to('.cover', {
        yPercent: -100,
        duration: 1.05,
        ease: 'power4.inOut',
      })
  }

  const chooseOuting = (next: OutingChoice) => {
    if (next === outing) return
    const wash = washRef.current
    const apply = () => {
      document.documentElement.dataset.theme = next
      setOuting(next)
    }

    if (!wash || prefersReducedMotion()) {
      apply()
      return
    }

    gsap.killTweensOf(wash)
    wash.dataset.to = next
    gsap
      .timeline()
      .to(wash, { opacity: 1, duration: 0.32, ease: 'power1.inOut' })
      .add(apply)
      .to(wash, { opacity: 0, duration: 0.5, ease: 'power2.out' })
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={publicFile('audio/right-now.mp3')}
        preload="auto"
        loop
      />
      <div className="wash" ref={washRef} aria-hidden="true" />
      {opened ? null : <Cover onOpen={openInvitation} />}
      <main className="page" aria-hidden={opened ? undefined : true}>
        <Letter
          accepted={accepted}
          onAccept={() => {
            if (accepted) return
            setAccepted(true)
            setSplashing(true)
          }}
        />
        {accepted ? (
          <div id="after-yes">
            <Outing value={outing} onChoose={chooseOuting} />
            <DatePick value={date} onChange={setDate} />
            <Portrait theme={outing ?? 'dusk'} />
            <Seal accepted={accepted} outing={outing} date={date} />
          </div>
        ) : null}
      </main>
      {opened ? <MusicButton playing={playing} onToggle={toggleSong} /> : null}
      {splashing ? (
        <RoseSplash
          onDone={() => {
            setSplashing(false)
            scrollToPlan('#outing')
          }}
        />
      ) : null}
    </>
  )
}

export default App
