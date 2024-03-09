import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import coin from '../../imgs/currImg.png'
import {observer} from "mobx-react";
import heads from '../../imgs/heads.png'
import tails from '../../imgs/tails.png'
import gem from "../../imgs/currImg.png";

function GameCreate() {
    const {store, globalStore} = useContext(Context);
    const [playerItems, setPlayerItems] = useState([]);
    const [chosenSide, setChosenSide] = useState('grey');
    const [chosenIndex, setChosenIndex] = useState([]);
    const [chosenItems, setChosenItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [approximate, setApproximate] = useState(0);
    const [errorMes, setErrorMes] = useState('No items to bet...');
    const [gemsBet, setGemsBet] = useState(0);
    const [oneClickGems, setOneClickGems] = useState(false);
    const [oneClickItems, setOneClickItems] = useState(false);

    useEffect(() => {
        const getUserItems = async () => {
            const items = await store.getUserItems(store.user.id);
            setPlayerItems(store.itemsList);
        }
        getUserItems();
    }, [store.user]);

    const handleBlur = () => {
        globalStore.setCreateOpen(false);
    }

    const addToCart = (index, item) => {
        if(chosenIndex.includes(index)) {
            setChosenIndex(chosenIndex.filter(item => item !== index));
            setChosenItems(chosenItems.filter(chosenItem => chosenItem.itemId !== item.itemId));
            setTotalValue(prevState => prevState -= item.price);
        } else {
            setChosenIndex((prevState) => prevState.concat(index));
            setChosenItems(prevState => prevState.concat(item));
            setTotalValue(prevState => prevState += item.price);
        }
    }
    const createGame = async () => {
        setOneClickItems(true);
        const game = await store.createGame(store.user, chosenItems, chosenSide);
        if(game.data && game.data.status && game.data.status === 400) {
            globalStore.setErrorMessage('Can not create game with nothing');
            globalStore.setCreateOpen(false);
            globalStore.setErrorWindow(true);
            setOneClickGems(false);
        } else {
            await store.checkAuth();
            globalStore.setCreateOpen(false);
            setOneClickItems(false);
        }
    }

    const handleBlurGem = () => {
        globalStore.setGemCreate(false);
    }

    const handleChangeGem = (event) => {
        setGemsBet(Math.floor(event.target.value * (store.user.balance / 10000)));
    }

    const createWithGems = async () => {
        setOneClickGems(true);
        const create = await store.createWithGems(store.user, gemsBet, chosenSide);
        if(create.data && create.data.status && create.data.status === 400) {
            globalStore.setErrorMessage('Can not create game with nothing');
            globalStore.setCreateOpen(false);
            globalStore.setGemCreate(false);
            globalStore.setErrorWindow(true);
            setOneClickGems(false);
        } else {
            setOneClickGems(false);
            globalStore.setGemCreate(false);
            globalStore.setCreateOpen(false);
            await store.checkAuth();
        }
    }

    const handleJoinGems = () => {
        globalStore.setGemCreate(true);
    }

    const handleAddItems = () => {
        globalStore.setCreateOpen(false);
        globalStore.setConnectModal(true);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            {globalStore.gemCreate &&
                <div className='backgroundModal' onClick={handleBlurGem}>
                    <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
                        <a className='infoJoinGems'>
                            Choose amount of gems to bet
                        </a>
                        <a className='gemsAmount'>{gemsBet} <img className='gemWorth' src={gem} alt='' /></a>
                        <input
                            type='range'
                            value={(gemsBet * 10000) / store.user.balance}
                            onChange={(event) => handleChangeGem(event)}
                            min='0'
                            max='10000'
                            className='gemSlider'
                        />
                        <button disabled={oneClickGems === true} className='btnCreateGame' style={{alignSelf: "center"}} onClick={createWithGems}>
                            Bet Gems
                        </button>
                    </div>
                </div>
            }
            <div className='modalWindowGame' onClick={(event) => event.stopPropagation()} style={{flexDirection: "column"}}>
                <div className='addItems'>
                    <div className='createWorth'>
                        <img className='marketCoinImg' src={coin} alt='' style={{height: 15, width: 15}}/>
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
                                        <img className='marketCoinImg' src={coin} alt='' />
                                        <a className='marketItemCost'>{Math.round(item.price)}</a>
                                    </div>
                                </li>
                            )) :
                            <a className='errorBet'>{errorMes}</a>
                        }
                    </div>
                    {playerItems.length === 0 &&
                        <button className='btnAddItems' onClick={handleAddItems} disabled={!store.user || !store.user.id}>
                            Add Items
                        </button>
                    }
                </div>
                <div className='beneathCreate'>
                    <div className='chooseSide'>
                        <img
                            className='chooseSideImg'
                            src={heads} alt=''
                            style={{boxShadow: chosenSide === 'red' ? '0 2px 15px rgba(239, 0, 0, 1)' : 'none'}}
                            onClick={() => setChosenSide('red')}
                        />
                        <img
                            className='chooseSideImg'
                            src={tails} alt=''
                            style={{boxShadow: chosenSide === 'grey' ? '0 2px 15px rgba(200, 200, 200, 1)' : 'none'}}
                            onClick={() => setChosenSide('grey')}
                        />
                    </div>
                </div>
                <div className='btnsJoin'>
                    <button className='btnCreateGame' disabled={!store.user || !store.user.id || !store.user.balance} onClick={handleJoinGems}>
                        Create With Gems
                    </button>
                    <button className='btnCreateGame' disabled={oneClickItems === true || !store.user || !store.user.id || playerItems.length === 0} onClick={() => createGame()}>
                        Create Game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(GameCreate);