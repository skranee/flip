import React, {useContext} from "react";
import ItemsList from "./itemsList";
import {observer} from "mobx-react";
import {Context} from "../index";

function GameModal({game}) {
    const {globalStore} = useContext(Context)
    const handleBlur = () => {
        globalStore.setViewOpen(false)
    }

    function calcChance(player, opponent) {
        return (player.bet / (player.bet + opponent.bet)).toFixed(2) * 100;
    }

    return (
        <div className='backgroundModal' onClick={() => handleBlur()}>
            <div className='modalWindowGame' onClick={(event) => event.stopPropagation()}>
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <img className='lobbyAvatar' src={game.player1.avatar} alt=''/>
                        <div className='usernameWorth'>
                            <a className='lobbyUsername'>{game.player1.name}</a>
                            <a className='lobbyWorthText'>Worth: </a>
                            <a className='lobbyWorth'>{game.player1.worth}R$</a>
                        </div>
                    </div>
                    <div className='lobbyPlayerBet'>
                        <a className='lobbyBet'>{game.player1.bet}R$</a>
                        <a className='lobbyChance'>{calcChance(game.player1, game.player2)}%</a>
                    </div>
                    <ItemsList items={game.player1.items} />
                </div>
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <img className='lobbyAvatar2' src={game.player2.avatar} alt=''/>
                        <div className='usernameWorth'>
                            <a className='lobbyUsername'>{game.player2.name}</a>
                            <a className='lobbyWorthText'>Worth: </a>
                            <a className='lobbyWorth'>{game.player2.worth}R$</a>
                        </div>
                    </div>
                    <div className='lobbyPlayerBet'>
                        <a className='lobbyBet'>{game.player2.bet}R$</a>
                        <a className='lobbyChance'>{calcChance(game.player2, game.player1)}%</a>
                    </div>
                    <ItemsList items={game.player2.items} />
                </div>
            </div>
        </div>
    )
}

export default observer(GameModal);