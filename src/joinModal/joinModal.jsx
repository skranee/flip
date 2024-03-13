import React, {useContext, useState, useEffect} from 'react';
import {Context} from "../index";
import gem from "../imgs/currImg.png";
import heads from "../imgs/heads.png";
import tails from "../imgs/tails.png";
import {observer} from "mobx-react";
import axios from "axios";
import {API_URL} from "../http";
import {joinGameFunction} from "../chat/chat";

function JoinModal({game}) {
    const {store, globalStore} = useContext(Context)
    const [playerItems, setPlayerItems] = useState(store.itemsList);
    const [chosenSide, setChosenSide] = useState('');
    const [chosenIndex, setChosenIndex] = useState([]);
    const [chosenItems, setChosenItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [approximate, setApproximate] = useState(0);
    const [errorMes, setErrorMes] = useState('No items to bet...');
    const [gemsBet, setGemsBet] = useState(game.bet ? Math.round(game.bet) : 0);
    const [oneClick, setOneClick] = useState(false);
    const [oneClickItems, setOneClickItems] = useState(false);

    useEffect(() => {
        const getUserItems = async () => {
            await store.getUserItems(store.user.id);
            setPlayerItems(store.itemsList);
        }
        getUserItems();
    }, [store.user, store]);

    useEffect(() => {
        const app = Math.round(game.bet);
        setApproximate(app);
    }, [game, game.bet]);

    useEffect(() => {
        if(game.side1 === 'red') {
            setChosenSide('grey');
        } else {
            setChosenSide('red');
        }
    }, [game]);

    const handleBlur = () => {
        globalStore.setJoinOpen(false);
    }

    const addToCart = (index, item) => {
        if(chosenIndex.includes(index)) {
            setChosenIndex(chosenIndex.filter(chosenIndex => chosenIndex !== index));
            setChosenItems(chosenItems.filter(chosenItem => chosenItem.itemId !== item.itemId));
            setTotalValue(prevState => prevState -= Math.round(item.price));
        } else {
            setChosenIndex((prevState) => prevState.concat(index));
            setChosenItems(prevState => prevState.concat(item));
            setTotalValue(prevState => prevState += Math.round(item.price));
        }
    }

    const betItems = async () => {
        if(totalValue >= approximate * 0.9 && totalValue <= approximate * 1.1 && totalValue > 0) {
            setOneClickItems(true);
            const join = await store.joinGame(store.user, chosenItems, chosenSide, game.gameId);
            setTimeout(async () => {
                const updateUser = async () => {
                    try {
                        const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true});
                        store.setUser(response.data.user);
                        store.setAuth(true);
                        localStorage.setItem('token', response.data.accessToken);
                        localStorage.setItem('username', response.data.user.username);
                    } catch(e) {
                        localStorage.removeItem('avatarUrl');
                        console.log(e.response?.data?.message);
                    }
                }
                await updateUser();
                }, 1800)
            setOneClickItems(false);
            globalStore.setJoinOpen(false);
            globalStore.setCheckLink(join.data.link);
            globalStore.setGameInfo(join.data.game);
            globalStore.setViewOpen(true);
            const message = {
                method: 'joinGame',
                game: join.data.game
            }
            joinGameFunction(message);
        } else {
            setOneClickItems(false);
            setErrorMes(`Items value must be between ${Math.round(approximate * 0.9)} and ${Math.round(approximate * 1.1)}`);
        }
    }

    const handleBlurGem = () => {
        setOneClick(false);
        globalStore.setGemJoin(false);
    }

    const handleChangeGem = (event) => {
        setGemsBet(Math.round(event.target.value));
    }

    const joinWithGems = async () => {
        if(gemsBet >= approximate * 0.9 && gemsBet <= approximate * 1.1 && store.user.balance >= gemsBet && gemsBet > 0) {
            setOneClick(true);
            const join = await store.joinWithGems(store.user, chosenSide, game.gameId, gemsBet);
            setTimeout(async () => {
                const updateUser = async () => {
                    try {
                        const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true});
                        store.setUser(response.data.user);
                        store.setAuth(true);
                        localStorage.setItem('token', response.data.accessToken);
                        localStorage.setItem('username', response.data.user.username);
                    } catch(e) {
                        localStorage.removeItem('avatarUrl');
                        console.log(e.response?.data?.message);
                    }
                }
                await updateUser();
            }, 1800)

            globalStore.setCheckLink(join.data.link);
            globalStore.setGemJoin(false);
            globalStore.setJoinOpen(false);
            globalStore.setGameInfo(join.data.game);
            globalStore.setViewOpen(true);
            setOneClick(false);
            const message = {
                method: 'joinGame',
                game: join.data.game
            }
            joinGameFunction(message);
        } else {
            setOneClick(false);
            globalStore.setGemJoin(false);
            setErrorMes(`Gems amount must be between ${Math.round(approximate * 0.9)} and ${Math.round(approximate * 1.1)}`)
        }
    }

    const handleJoinGems = () => {
        globalStore.setGemJoin(true);
    }

    const handleAddItems = () => {
        globalStore.setJoinOpen(false);
        globalStore.setConnectModal(true);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            {globalStore.gemJoin &&
                <div className='backgroundModal' onClick={handleBlurGem}>
                    <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
                        <p className='infoJoinGems'>
                            Gems amount must be between <span style={{color: 'rgba(255, 255, 255, 1)', fontWeight: 700}}>{Math.round(approximate * 0.9)}<img src={gem} className='gemWorth' alt='' /></span> and <span style={{color: 'rgba(255, 255, 255, 1)', fontWeight: 700}}>{Math.round(approximate * 1.1)}<img src={gem} className='gemWorth' alt='' /></span>
                        </p>
                        <span className='gemsAmount'>{gemsBet} <img className='gemWorth' src={gem} alt='' /></span>
                        <input
                            type='range'
                            value={gemsBet}
                            onChange={(event) => handleChangeGem(event)}
                            min={Math.round(approximate * 0.9)}
                            max={Math.round(approximate * 1.1)}
                            className='gemSlider'
                        />
                        <button className='btnCreateGame' disabled={oneClick} style={{alignSelf: "center"}} onClick={joinWithGems}>
                            Bet Gems
                        </button>
                    </div>
                </div>
            }
            <div className='modalWindowGame' onClick={(event) => event.stopPropagation()} style={{flexDirection: "column"}}>
                <div className='addItems'>
                    <div className='createWorth'>
                        <img className='marketCoinImg' src={gem} alt='' style={{height: 15, width: 15}}/>
                        <span>{Math.round(totalValue)}</span>
                    </div>
                    <p className='approximateJoin'>
                        <span className='approximatePartly'><img src={gem} className='gemWorth' alt='gem' />{Math.round(approximate * 0.9)}</span> —
                        <span className='approximatePartly'><img src={gem} className='gemWorth' alt='gem' /> {Math.round(approximate * 1.1)}</span>
                    </p>
                    <div className='itemsAddContainer' style={{padding: 10}}>
                        {playerItems.length ?
                            playerItems.map((item, index) => (
                                <li
                                    className='addItemContainer'
                                    key={index}
                                    style={{outline: chosenIndex.includes(index) ? 'solid 1px rgba(255, 255, 255, 0.9)' : 'none', cursor: "pointer"}}
                                    onClick={() => addToCart(index, item)}
                                >
                                    <img className='marketItemImg' src={item.image} alt='' />
                                    <span className='marketItemClass'>{item.class}</span>
                                    <span className='marketItemName'>{item.name}</span>
                                    <div className='marketItemCostContainer'>
                                        <img className='marketCoinImg' src={gem} alt='' />
                                        <span className='marketItemCost'>{Math.round(item.price)}</span>
                                    </div>
                                </li>
                            )) :
                            <span className='errorBet'>{errorMes}</span>
                        }
                    </div>
                    {playerItems.length === 0 &&
                        <button className='btnAddItems' onClick={handleAddItems} disabled={!store.user || !store.user.id}>
                            Add Items
                        </button>
                    }
                </div>
                <div className='chooseSide'>
                    <img
                        className='chooseSideImg'
                        src={heads} alt=''
                        style={{boxShadow: chosenSide === 'red' ? '0 2px 15px rgba(239, 0, 0, 1)' : 'none', cursor: "default"}}
                    />
                    <img
                        className='chooseSideImg'
                        src={tails} alt=''
                        style={{boxShadow: chosenSide === 'grey' ? '0 2px 15px rgba(200, 200, 200, 1)' : 'none', cursor: "default"}}
                    />
                </div>
                <div className='btnsJoin'>
                    <button className='btnCreateGame' onClick={handleJoinGems} disabled={!store.user || !store.user.id || !store.user.balance}>
                        Join With Gems
                    </button>
                    <button className='btnCreateGame' disabled={oneClickItems === true || !store.user || !store.user.id || playerItems.length === 0} onClick={() => betItems()}>
                        Join Game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(JoinModal);