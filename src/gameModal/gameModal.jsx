import React, {useContext} from "react";
import ItemsList from "./itemsList";
import {observer} from "mobx-react";
import {Context} from "../index";
import CoinFlip from "./coinFlip";
import coinHeads from '../imgs/coinHeads.png'
import coinTails from '../imgs/coinTails.png'
import question from '../imgs/question.png'
import {currProp} from "../market/market";
import gem from "../imgs/currImg.png";

function GameModal({game}) {
    const {store, globalStore} = useContext(Context)
    const player1Bet = Math.round(game.items1.reduce((a, b) => a + b.price, 0) / currProp);
    const player2Bet = Math.round(game.items2.reduce((a, b) => a + b.price, 0) / currProp);

    const handleBlur = () => {
        globalStore.setViewOpen(false)
    }

    function calcChance(player, opponent) {
        return (player / (player + opponent)).toFixed(2) * 100;
    }

    const endGame = async () => { //!!!!!!!
        const deleteGame = await store.endGame(game.gameId);
        const add = await store.addHistory(store.user.id, game);
        globalStore.setViewOpen(false);
    }

    return (
        <div className='backgroundModal' onClick={() => handleBlur()}>
            <div className='modalWindowGame' onClick={(event) => event.stopPropagation()}>
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <div className='avatarContainerLobby'>
                            <img
                                className='lobbyAvatar'
                                style={{
                                    boxShadow: game.side1 === 'red' ? '0 0 25px 5px rgba(255, 0, 0, 0.4)' :
                                        '0 0 25px 5px rgba(5, 5, 5, 0.85)'
                                }}
                                src={game.player1.avatar}
                                alt=''
                            />
                        </div>
                        <div className='usernameWorth'>
                            <a className='lobbyUsername'>{game.player1.username}</a>
                            <a className='lobbyWorthText'>Worth: </a>
                            <a className='lobbyWorth'>{player1Bet} <img src={gem} className='gemWorth' alt='' /> </a>
                        </div>
                    </div>
                    <div className='lobbyPlayerBet'>
                        <a className='lobbyBet'>{player1Bet} <img src={gem} className='gemWorth' alt='' /> </a>
                        <a className='lobbyChance'>{calcChance(player1Bet, player2Bet)}%</a>
                    </div>
                    <ItemsList items={game.items1} />
                </div>
                <button onClick={endGame}>
                    end
                </button>
                <CoinFlip />
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <div className='avatarContainerLobby'>
                            <img
                                className='lobbyAvatar2'
                                style={{
                                    boxShadow: game.side1 === 'black' ? '0 0 25px 5px rgba(255, 0, 0, 0.4)' :
                                        '0 0 25px 5px rgba(5, 5, 5, 0.85)'
                                }}
                                src={game.player2 ? game.player2.avatar : question}
                                alt=''
                            />
                        </div>
                        <div className='usernameWorth'>
                            <a className='lobbyUsername'>{game.player2 ? game.player2.username : '???'}</a>
                            <a className='lobbyWorthText'>Worth: </a>
                            <a className='lobbyWorth'>{game.player2 ? player2Bet : '?'} <img src={gem} className='gemWorth' alt='' /> </a>
                        </div>
                    </div>
                    <div className='lobbyPlayerBet'>
                        <a className='lobbyBet'>{game.player2 ? player2Bet: '?'} <img src={gem} className='gemWorth' alt='' /> </a>
                        <a className='lobbyChance'>{calcChance(player2Bet, player1Bet)}%</a>
                    </div>
                    {game.items2 &&
                        <ItemsList items={game.items2} />
                    }
                </div>
            </div>
        </div>
    )
}

export default observer(GameModal);