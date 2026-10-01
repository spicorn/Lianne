import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { prefersReducedMotion } from '../motion'
import { publicFile } from '../publicFile'

type CoverProps = {
  onOpen: () => void
}

export function Cover({ onOpen }: CoverProps) {
  const reduced = prefersReducedMotion()

  return (
    <div className="cover">
      <div className="cover__card">
        <div className="cover__heart" aria-hidden="true">
          <DotLottieReact
            src={publicFile('lottie/heart.json?v=2')}
            loop
            autoplay={!reduced}
            speed={0.85}
          />
        </div>
        <p className="kicker">For you</p>
        <h1 className="script">Lianne</h1>
        <p className="cover__line">
          Its been a while. So is a question awaitng!!
        </p>
        <button type="button" className="yes" onClick={onOpen}>
          Open the invitation
        </button>
        <p className="credit">Yours Suspect</p>
      </div>
    </div>
  )
}
