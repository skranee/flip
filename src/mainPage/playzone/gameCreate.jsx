import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import {items} from "./gamesInfo";
import {currProp} from "../../market/market";
import coin from '../../imgs/currImg.png'
import {observer} from "mobx-react";
import heads from '../../imgs/heads.png'
import tails from '../../imgs/tails.png'

function GameCreate() {
    const {store, globalStore} = useContext(Context);
    const [playerItems, setPlayerItems] = useState([]);
    const [chosenSide, setChosenSide] = useState('black')
    const handleBlur = () => {
        globalStore.setCreateOpen(false);
    }

    const addItems = () => {
        const newItem = items.slice(0, 15);
        setPlayerItems(newItem);
    }

    const createGame = async () => {
        const game = await store.createGame(store.user, playerItems, chosenSide);
        globalStore.setCreateOpen(false);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalWindowGame' onClick={(event) => event.stopPropagation()} style={{flexDirection: "column"}}>
                <div className='addItems'>
                    <div className='createWorth'>
                        <img className='marketCoinImg' src={coin} alt='' style={{height: 15, width: 15}}/>
                        <a>{Math.round(playerItems.reduce((a, b) => a + b.price, 0) / currProp)}</a>
                    </div>
                    <div className='itemsAddContainer'>
                        {playerItems.map((item, index) => (
                            <li className='addItemContainer' key={index}>
                                <img className='marketItemImg' src={item.image} alt='' />
                                <a className='marketItemClass'>{item.class}</a>
                                <a className='marketItemName'>{item.name}</a>
                                <div className='marketItemCostContainer'>
                                    <img className='marketCoinImg' src={coin} alt='' />
                                    <a className='marketItemCost'>{Math.round(item.price / currProp)}</a>
                                </div>
                            </li>
                        ))}
                    </div>
                    {playerItems.length === 0 &&
                        <button className='btnAddItems' onClick={addItems}>
                            Add Items
                        </button>
                    }
                </div>
                <div className='chooseSide'>
                    <img
                        className='chooseSideImg'
                        src={heads} alt=''
                        style={{boxShadow: chosenSide === 'black' ? '0 2px 15px rgba(0, 0, 0, 0.7)' : 'none'}}
                        onClick={() => setChosenSide('black')}
                    />
                    <img
                        className='chooseSideImg'
                        src={tails} alt=''
                        style={{boxShadow: chosenSide === 'red' ? '0 2px 15px rgba(153, 0, 0, 0.7)' : 'none'}}
                        onClick={() => setChosenSide('red')}
                    />
                </div>
                <button className='btnCreateGame' disabled={playerItems.length === 0} onClick={() => createGame()}>
                    Create Game
                </button>
            </div>
        </div>
    )
}

export default observer(GameCreate);