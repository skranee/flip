import React, {useContext, useEffect, useState} from "react";
import ItemsList from "./itemsList";
import {observer} from "mobx-react";
import {Context} from "../index";
import CoinFlip from "./coinFlip";
import gem from "../imgs/currImg.png";
import { HiDotsHorizontal } from "react-icons/hi";

function GameModal({game}) {
    const {store, globalStore} = useContext(Context)
    const [pointerEvents, setPointerEvents] = useState('none');
    const [opacityFairness, setOpacityFairness] = useState(0);
    const player1Bet = (game && game.items1) ? game.items1.length > 0 ? Math.round(game.items1.reduce((a, b) => a + b.price, 0)) : Math.round(game.gems1) : 0;
    const player2Bet = (game && game.items2) ? game.items2.length > 0 ? Math.round(game.items2.reduce((a, b) => a + b.price, 0)) : Math.round(game.gems2) : 0;
    const [countShow, setCountShow] = useState(3);

    useEffect(() => {
        setTimeout(() => {
            if(game.result && game.player2 && (game.player1._id === store.user.id || game.player2._id === store.user.id)) {
                setPointerEvents('');
                setOpacityFairness(1);
            } else {
                setPointerEvents('none');
                setOpacityFairness(0);
            }
        }, 4500)
    }, [game, store.user.id, ]);

    useEffect(() => {
        if(globalStore.countdown === true) {
            let count = 3;
            const startCountdown = setInterval(() => {
                count--;
                setCountShow(count);
                if(count === 0) {
                    globalStore.setCountdown(false);
                    clearInterval(startCountdown);
                }
            }, 1000)
        }
    }, [game, globalStore, ])

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

    const checkResult = () => {
        window.open(game.checkLink);
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
                                    border: game.side1 === 'grey' ? 'solid 3px rgba(200, 200, 200, 1)' :
                                        'solid 3px rgba(255, 0, 0, 1)'
                                }}
                                src={game.player1.avatar}
                                alt=''
                            />
                        </div>
                        <div className='usernameWorth'>
                            <span className='lobbyUsername'>{game.player1.username}</span>
                            <span className='lobbyWorthText'>Worth: </span>
                            <span className='lobbyWorth'>{player1Bet} <img src={gem} className='gemWorth' alt='' /> </span>
                        </div>
                    </div>
                    <div className='lobbyPlayerBet'>
                        <span className='lobbyBet'>{player1Bet} <img src={gem} className='gemWorth' alt='' /> </span>
                        <span className='lobbyChance'>{calcChance(player1Bet, player2Bet)}%</span>
                    </div>
                    <ItemsList items={game.items1} />
                </div>
                {globalStore.countdown && (store.user.id === game.player1._id || store.user.id === game.player2._id) &&
                    <div className='countdownContainer'>
                        <span className='countdownText'>{countShow}</span>
                    </div>
                }
                {!globalStore.countdown && <CoinFlip game={game} />}
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <div className='avatarContainerLobby'>
                            {game.player2 ?
                                <img className='lobbyAvatar2'
                                     style={{
                                         border: game.side1 === 'red' ? 'solid 3px rgba(200, 200, 200, 1)' :
                                             'solid 3px rgba(239, 0, 0, 1)'
                                     }}
                                     src={game.player2.avatar}
                                     alt=''/>
                                :
                                <div className='lobbyAvatar2'
                                     style={{
                                         border: game.side1 === 'red' ? 'solid 3px rgba(200, 200, 200, 1)' :
                                             'solid 3px rgba(239, 0, 0, 1)'
                                     }}>
                                    <HiDotsHorizontal style={{fontSize: '1.8em'}} />
                                </div>
                            }
                        </div>
                        <div className='usernameWorth'>
                            <span className='lobbyUsername'>{game.player2 ? game.player2.username : '???'}</span>
                            <span className='lobbyWorthText'>Worth: </span>
                            <span className='lobbyWorth'>{game.player2 ? player2Bet : '?'} <img src={gem} className='gemWorth' alt='' /> </span>
                        </div>
                    </div>
                    <div className='lobbyPlayerBet'>
                        <span className='lobbyBet'>{game.player2 ? player2Bet: '?'} <img src={gem} className='gemWorth' alt='' /> </span>
                        <span className='lobbyChance'>{calcChance(player2Bet, player1Bet)}%</span>
                    </div>
                    {game.items2 &&
                        <ItemsList items={game.items2} />
                    }
                </div>
                <div className='btnCheckResultContainer'>
                    <button
                        className='btnCheckResult'
                        onClick={checkResult}
                        style={{opacity: `${opacityFairness}`, pointerEvents: pointerEvents}}
                    >
                        Provably Fair
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(GameModal);