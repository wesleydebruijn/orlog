import React from 'react'
import { useParams } from 'react-router'
import CategoryBox from '../../../../../shared/ContentBox/ContentBox'

import Topbar from '../../../../../shared/Topbar/Topbar'

import './GameStateWaiting.scss'

export default function GameStateWaiting() {
  const { gameId } = useParams<{ gameId: string }>()
  const link = `${process.env.REACT_APP_BASE_URL}/game/${gameId}`

  return (
    <div className="game-state-waiting">
      <Topbar title="Waiting for opponent..." />
      <main>
        <CategoryBox title="Invite a friend">
          <p>
            By sharing this link with a friend, cat or dog you can play against them and most likely
            defeat them because they probably don't know to play it yet anyway. Definitely your pet
            though.
          </p>
          <input
            type="text"
            readOnly={true}
            defaultValue={`${process.env.REACT_APP_BASE_URL}/game/${gameId}`}
          />
          <section className="game-state-waiting__actions">
            <CopyButton text={link}>Copy invite link</CopyButton>
            <ShareButton
              url={link}
              title="Play Orlog"
              text="Defeat enemy vikings in this amazing board game"
            >
              Share
            </ShareButton>
          </section>
        </CategoryBox>
      </main>
    </div>
  )
}

export function CopyButton({ text, children }: { text: string; children: React.ReactNode }) {
  if (navigator.clipboard) {
    return (
      <button onClick={async () => await navigator.clipboard.writeText(text)}>{children}</button>
    )
  }

  return null
}

export function ShareButton({
  title,
  text,
  url,
  children
}: {
  title: string
  text: string
  url: string
  children: React.ReactNode
}) {
  if (navigator.share !== undefined) {
    return (
      <button onClick={async () => await navigator.share({ title, text, url })}>{children}</button>
    )
  }

  return null
}
