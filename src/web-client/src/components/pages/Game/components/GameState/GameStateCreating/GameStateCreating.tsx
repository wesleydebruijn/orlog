import React, { useState } from 'react'
import Slider from 'rc-slider'

import { ChangeSettingsData } from '../../../../../../types/types'

import Button from '../../../../../shared/Button/Button'
import ContentBox from '../../../../../shared/ContentBox/ContentBox'
import { GameTopbar } from '../../../../../shared/Topbar/GameTopBar'

import './GameStateCreating.scss'
import 'rc-slider/assets/index.css'

type Props = {
  settings: ChangeSettingsData
  onCreate: (settings: ChangeSettingsData) => void
}

export default function GameStateCreating({ onCreate, settings }: Props) {
  const [isCustom, setCustom] = useState(false)
  const [currentSettings, setSettings] = useState(settings)

  function createGame(settings: ChangeSettingsData) {
    onCreate(settings)
  }

  return (
    <div className="game-state-creating">
      <GameTopbar title="Creating game" />
      <div className="container">
        {isCustom ? (
          <div className="game-state-creating__settings">
            <ContentBox title="Settings">
              <p>Amount of dices</p>
              <Slider
                min={2}
                max={8}
                defaultValue={6}
                onChange={value => setSettings({ ...currentSettings, dices: value })}
                marks={{
                  2: '2',
                  4: '4',
                  6: '6',
                  8: '8'
                }}
              />
              <p>Health</p>
              <Slider
                min={5}
                max={30}
                defaultValue={15}
                onChange={value => setSettings({ ...currentSettings, health: value })}
                marks={{
                  5: '5',
                  10: '10',
                  15: '15',
                  20: '20',
                  25: '25',
                  30: '30'
                }}
              />
              <p>Starting tokens</p>
              <Slider
                min={0}
                max={10}
                defaultValue={0}
                onChange={value => setSettings({ ...currentSettings, tokens: value })}
                marks={{
                  0: '0',
                  2: '2',
                  4: '4',
                  6: '6',
                  8: '8',
                  10: '10'
                }}
              />
              <p>Amount of favors</p>
              <Slider
                min={1}
                max={5}
                defaultValue={3}
                onChange={value => setSettings({ ...currentSettings, favors: value })}
                marks={{
                  1: '1',
                  2: '2',
                  3: '3',
                  4: '4',
                  5: '5'
                }}
              />
              <Button onClick={() => createGame(currentSettings)}>Create game</Button>
            </ContentBox>
          </div>
        ) : (
          <div className="game-state-creating__choice">
            <ContentBox title="Default">
              <p>Default Orlog game as played in Assassin's Creed.</p>
              <Button onClick={() => createGame({})}>Create default</Button>
            </ContentBox>
            <ContentBox title="Custom">
              <p>Enables you to customize the settings of the game.</p>
              <Button onClick={() => setCustom(true)}>Create custom</Button>
            </ContentBox>
          </div>
        )}
      </div>
    </div>
  )
}
