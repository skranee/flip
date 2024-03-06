import React, {useContext, useEffect, useState} from "react";
import ItemsList from "./itemsList";
import {observer} from "mobx-react";
import {Context} from "../index";
import CoinFlip from "./coinFlip";
import coinHeads from '../imgs/coinHeads.png'
import coinTails from '../imgs/coinTails.png'
import question from '../imgs/question.png'
import {currProp} from "../market/market";
import gem from "../imgs/currImg.png";
import { HiDotsHorizontal } from "react-icons/hi";
import cheerio from 'cheerio';
import axios from "axios";

function GameModal({game}) {
    const {store, globalStore} = useContext(Context)
    const [pointerEvents, setPointerEvents] = useState('none');
    const [opacityFairness, setOpacityFairness] = useState(0);
    const [widthBtn, setWidthBtn] = useState(0);
    const player1Bet = game.items1.length > 0 ? Math.round(game.items1.reduce((a, b) => a + b.price, 0) / currProp) : Math.round(game.gems1)
    const player2Bet = game.items2.length > 0 ? Math.round(game.items2.reduce((a, b) => a + b.price, 0) / currProp) : Math.round(game.gems2)

    useEffect(() => {
        setTimeout(() => {
            if(game.result && game.player2 && (game.player1._id === store.user.id || game.player2._id === store.user.id)) {
                setPointerEvents('');
                setOpacityFairness(1);
            } else {
                setPointerEvents('none');
                setOpacityFairness(0);
            }
        }, 3200)
    }, [game, ]);

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
        // const payments = await store.getPayments(store.user.id);
        // console.log(payments);

        // const db = JSON.parse(fixedJsonString);
        // const objects = Object.values(db);
        // const shiny = objects.find(item => item.ItemName === 'Shiny');

        // const add = await store.addItemBot("5310737222", {
        //     image: '',
        //     name: 'ElderwoodScythe',
        //     price: 0,
        //     owner: '',
        //     id: '',
        //     rarity: '',
        //     itemId: ''
        // })

        // const addBot = await store.addBot(botsInfo[0].serverUrl, botsInfo[0].name, botsInfo[0].image, botsInfo[0].robloxId);
    }

    const checkResult = () => {
        window.open(globalStore.checkLink);
    }

    const parseHtml = async () => {
        const htmlContent = await axios.get('https://mm2values.com/?p=common');
        const $ = cheerio.load(`${htmlContent}`);
        const sparkle10Element = $('.linkTable:contains("Sparkle10")').first();
        if(sparkle10Element.length > 0) {
            const imgSrc = sparkle10Element.find('img').attr('src');
            const valueMatch = sparkle10Element.text().match(/VALUE: (\d+)/);
            const value = valueMatch ? valueMatch[1] : null


            console.log(imgSrc);
            console.log(value);
        } else {
            console.log('That element was not found')
        }
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
                <CoinFlip game={game} />
                <div className='lobbyPlayerContainer'>
                    <div className='lobbyUpperInfo'>
                        <div className='avatarContainerLobby'>
                            {game.player2 ?
                                <img className='lobbyAvatar2'
                                     style={{
                                         boxShadow: game.side1 === 'black' ? '0 0 20px 5px rgba(200, 200, 200, 1)' :
                                             '0 0 25px 5px rgba(239, 0, 0, 1)',
                                         border: game.side1 === 'black' ? 'solid 3px rgba(200, 200, 200, 1)' :
                                             'solid 3px rgba(239, 0, 0, 1)'
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