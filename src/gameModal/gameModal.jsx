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
import {items} from "../mainPage/playzone/gamesInfo";
import { HiDotsHorizontal } from "react-icons/hi";

function GameModal({game}) {
    const {store, globalStore} = useContext(Context)
    const player1Bet = game.items1.length > 0 ? Math.round(game.items1.reduce((a, b) => a + b.price, 0) / currProp) : Math.round(game.gems1)
    const player2Bet = game.items2.length > 0 ? Math.round(game.items2.reduce((a, b) => a + b.price, 0) / currProp) : Math.round(game.gems2)

    const handleBlur = () => {
        globalStore.setViewOpen(false)
    }

    function calcChance(player, opponent) {
        if(!player) {
            player = 0;
        }
        if(!opponent) {
            opponent = 0;
        }
        return ((player / (player + opponent)).toFixed(4) * 100).toFixed(2);
    }

    const endGame = async () => { //!!!!!!!
        // const deleteGame = await store.endGame(game.gameId);
        // const add = await store.addHistory(store.user.id, game);
        // globalStore.setViewOpen(false);
        // const response = await store.findWinner(game.gameId);
        // console.log(response.data)
        // const add = await store.addItemBot(store.user.robloxId, items[10])
        // const id = await store.getAccountId();
        // const address = await store.createPaymentAddress(id.data, 'BTC');
        // console.log(address.data)
        // const item = await store.createItem('testgun', 1);
        // const response = await store.getTransactions();
        // console.log(response);
        const payments = await store.getPayments(store.user.id);
        console.log(payments);
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
                                    boxShadow: game.side1 === 'red' ? '0 0 20px 5px rgba(200, 200, 200, 1)' :
                                        '0 0 25px 5px rgba(255, 0, 0, 1)',
                                    border: game.side1 === 'red' ? 'solid 3px rgba(200, 200, 200, 1)' :
                                        'solid 3px rgba(255, 0, 0, 1)'
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
                {/*<button onClick={endGame}>*/}
                {/*    end*/}
                {/*</button>*/}
                <CoinFlip />
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <div className='avatarContainerLobby'>
                            {game.player2 ?
                                <img className='lobbyAvatar2'
                                     style={{
                                         boxShadow: game.side1 === 'black' ? '0 0 20px 5px rgba(200, 200, 200, 1)' :
                                             '0 0 25px 5px rgba(239, 0, 0, 1)'
                                     }}
                                     src={game.player2.avatar}
                                     alt=''/>
                                :
                                <div className='lobbyAvatar2'
                                     style={{
                                         boxShadow: game.side1 === 'black' ? '0 0 20px 5px rgba(200, 200, 200, 1)' :
                                             '0 0 20px 5px rgba(239, 0, 0, 1)',
                                         border: game.side1 === 'black' ? 'solid 3px rgba(200, 200, 200, 1)' :
                                             'solid 3px rgba(239, 0, 0, 1)'
                                     }}>
                                    <HiDotsHorizontal style={{fontSize: '1.8em'}} />
                                </div>
                            }
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