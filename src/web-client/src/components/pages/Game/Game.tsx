import React from 'react'

import './Game.scss'

import Player from './components/Player/Player'
import DiceGrid from './components/Dice/DiceGrid/DiceGrid'
import PlayerArea from './components/Player/Area/PlayerArea'
import FavorArea from './components/Favor/FavorArea/FavorArea'
import ContinueButton from './components/ContinueButton/ContinueButton'
import {
  getOpponentFavors,
  getOpponentPlayer,
  getPlayer,
  getPlayerFavors
} from '../../../selectors/selectors'
import { GameLobbyProvider } from '../../../providers/GameLobbyProvider'
import { useParams } from 'react-router'
import { useUser } from '../../../hooks/useAuth'
export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const { id: userId } = useUser()

  return (
    <GameLobbyProvider gameId={gameId} userId={userId}>
      {({ state, actions, status }) => {
        switch (status) {
          case 'waiting':
            return <h2>Wachten op enemy</h2>
          case 'playing':
            return (
              <div className="game">
                <PlayerArea player={getOpponentPlayer(state)}>
                  {opponent => (
                    <>
                      <div className="wrapper wrapper--flex">
                        <Player
                          name="Wesley"
                          avatar="https://images.ctfassets.net/cnu0m8re1exe/621LK0hTGKrRBzXdnqiuuE/e82b6415d8dec51658f2acd6ea6b70b7/viking.jpg?w=650&h=433&fit=fill"
                          health={opponent.health}
                        />
                        <FavorArea favors={getOpponentFavors(state)} />
                      </div>
                      <DiceGrid dices={opponent.dices} />
                    </>
                  )}
                </PlayerArea>
                <ContinueButton
                  text="Continue"
                  onClick={() => actions.doContinue()}
                  disabled={state.lobby.turn !== state.lobby.game.turn}
                />
                <PlayerArea player={getPlayer(state)} self>
                  {player => (
                    <>
                      <div className="wrapper wrapper--flex">
                        <Player
                          name="Jeffrey"
                          avatar="https://www.nationalgeographic.com/content/dam/news/2018/01/19/viking/01-viking-NationalGeographic_2515792.ngsversion.1516396230234.adapt.1900.1.jpg"
                          health={player.health}
                        />
                        <FavorArea
                          favors={getPlayerFavors(state)}
                          onFavorSelect={actions.selectFavor}
                        />
                      </div>
                      <DiceGrid dices={player.dices} onToggleDice={actions.toggleDice} />
                    </>
                  )}
                </PlayerArea>
              </div>
            )
        }
      }}
    </GameLobbyProvider>
  )
}
