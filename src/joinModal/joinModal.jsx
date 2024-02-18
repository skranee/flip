import React, {useContext, useState, useEffect} from 'react';
import {Context} from "../index";
import gem from "../imgs/currImg.png";
import {currProp} from "../market/market";
import heads from "../imgs/heads.png";
import tails from "../imgs/tails.png";
import {observer} from "mobx-react";

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

    useEffect(() => {
        const getUserItems = async () => {
            const items = await store.getUserItems(store.user.id);
            setPlayerItems(store.itemsList);
        }
        getUserItems();
    }, [store.user]);

    useEffect(() => {
        const app = Math.round(game.bet);
        setApproximate(app);
    }, []);

    useEffect(() => {
        if(game.side1 === 'red') {
            setChosenSide('black');
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
            setTotalValue(prevState => prevState -= Math.round(item.price / 2.5));
        } else {
            setChosenIndex((prevState) => prevState.concat(index));
            setChosenItems(prevState => prevState.concat(item));
            setTotalValue(prevState => prevState += Math.round(item.price / 2.5));
        }
    }

    const betItems = async () => {
        if(totalValue >= approximate * 0.9 && totalValue <= approximate * 1.1) {
            const join = await store.joinGame(store.user, chosenItems, chosenSide, game.gameId);
            await store.checkAuth();
            globalStore.setJoinOpen(false);
            console.log(join.data.link)
            console.log(join.data.number);
            console.log(join.data.game)
        } else {
            setErrorMes(`Items value must be between ${Math.round(approximate * 0.9)} and ${Math.round(approximate * 1.1)}`);
        }
    }

    const handleBlurGem = () => {
        globalStore.setGemJoin(false);
    }

    const handleChangeGem = (event) => {
        setGemsBet(Math.round(event.target.value));
    }

    const joinWithGems = async () => {
        if(gemsBet >= approximate * 0.9 && gemsBet <= approximate * 1.1) {
            const join = await store.joinWithGems(store.user, chosenSide, game.gameId, gemsBet);
            await store.checkAuth();
            globalStore.setGemJoin(false);
            globalStore.setJoinOpen(false);
            console.log(join);
        } else {
            setErrorMes(`Gems amount must be between ${Math.round(approximate * 0.9)} and ${Math.round(approximate * 1.1)}`)
        }
    }

    const handleJoinGems = () => {
        globalStore.setGemJoin(true);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            {globalStore.gemJoin &&
                <div className='backgroundModal' onClick={handleBlurGem}>
                    <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
                        <a className='infoJoinGems'>
                            Gems amount must be between <a style={{color: 'rgba(255, 255, 255, 1)', fontWeight: 700}}>{Math.round(approximate * 0.9)}<img src={gem} className='gemWorth' alt='' /></a> and <a style={{color: 'rgba(255, 255, 255, 1)', fontWeight: 700}}>{Math.round(approximate * 1.1)}<img src={gem} className='gemWorth' alt='' /></a>
                        </a>
                        <a className='gemsAmount'>{gemsBet} <img className='gemWorth' src={gem} alt='' /></a>
                        <input
                            type='range'
                            value={gemsBet}
                            onChange={(event) => handleChangeGem(event)}
                            min={Math.round(approximate * 0.9)}
                            max={Math.round(approximate * 1.1)}
                            className='gemSlider'
                        />
                        <button className='btnCreateGame' style={{alignSelf: "center"}} onClick={joinWithGems}>
                            Bet Gems
                        </button>
                    </div>
                </div>
            }
            <div className='modalWindowGame' onClick={(event) => event.stopPropagation()} style={{flexDirection: "column"}}>
                <div className='addItems'>
                    <div className='createWorth'>
                        <img className='marketCoinImg' src={gem} alt='' style={{height: 15, width: 15}}/>
                        <a>{Math.round(totalValue)}</a>
                    </div>
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
                                    <a className='marketItemClass'>{item.class}</a>
                                    <a className='marketItemName'>{item.name}</a>
                                    <div className='marketItemCostContainer'>
                                        <img className='marketCoinImg' src={gem} alt='' />
                                        <a className='marketItemCost'>{Math.round(item.price / currProp)}</a>
                                    </div>
                                </li>
                            )) :
                            <a className='errorBet'>{errorMes}</a>
                        }
                    </div>
                    {playerItems.length === 0 &&
                        <button className='btnAddItems'>
                            Add Items
                        </button>
                    }
                </div>
                <div className='chooseSide'>
                    <img
                        className='chooseSideImg'
                        src={heads} alt=''
                        style={{boxShadow: chosenSide === 'black' ? '0 2px 15px rgba(239, 0, 0, 1)' : 'none', cursor: "default"}}
                    />
                    <img
                        className='chooseSideImg'
                        src={tails} alt=''
                        style={{boxShadow: chosenSide === 'red' ? '0 2px 15px rgba(200, 200, 200, 1)' : 'none', cursor: "default"}}
                    />
                </div>
                <div className='btnsJoin'>
                    <button className='btnCreateGame' onClick={handleJoinGems}>
                        Join With Gems
                    </button>
                    <button className='btnCreateGame' disabled={playerItems.length === 0} onClick={() => betItems()}>
                        Join Game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(JoinModal);