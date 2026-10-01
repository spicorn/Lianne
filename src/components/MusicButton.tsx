// import { Pause, Play } from 'lucide-react'

type MusicButtonProps = {
  playing: boolean
  onToggle: () => void
}

export function MusicButton({ playing, onToggle }: MusicButtonProps) {
  return (
    <button
      type="button"
      className="music"
      onClick={onToggle}
      aria-label={
        playing ? 'Pause Right Now by Akon' : 'Play Right Now by Akon'
      }
    >
      {/* {playing ? (
        <Pause className="icon icon-sm" aria-hidden="true" />
      ) : (
        <Play className="icon icon-sm" aria-hidden="true" />
      )} */}
      <span>Yours Suspect</span>
    </button>
  )
}
