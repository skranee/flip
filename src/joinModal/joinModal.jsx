import React, {useContext, useState, useEffect} from 'react';
import {Context} from "../index";
import coin from "../imgs/currImg.png";
import {currProp} from "../market/market";
import heads from "../imgs/heads.png";
import tails from "../imgs/tails.png";
import {observer} from "mobx-react";

function JoinModal({game}) {
    const {store, globalStore} = useContext(Context)
    const [playerItems, setPlayerItems] = useState(store.user.itemsList);
    const [chosenSide, setChosenSide] = useState('')
    const [chosenItems, setChosenItems] = useState([])
    const [totalValue, setTotalValue] = useState(0);
    const [approximate, setApproximate] = useState(0);
    const [errorMes, setErrorMes] = useState('No items to bet...');

    useEffect(() => {
        const app = Math.round(game.items1.reduce((a, b) => a + b.price, 0) / currProp)
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
        if(chosenItems.includes(index)) {
            setChosenItems(chosenItems.filter(item => item !== index));
            setTotalValue(prevState => prevState -= item.price / 2.5);
        } else {
            setChosenItems((prevState) => prevState.concat(index));
            setTotalValue(prevState => prevState += item.price / 2.5);
        }
    }

    const betItems = async () => {
        if(totalValue >= approximate * 0.95 && totalValue <= approximate * 1.05) {
            const join = await store.joinGame(store.user, playerItems, chosenSide, game.gameId);
        } else {
            setErrorMes(`Items value must be between ${approximate * 0.95} and ${approximate * 1.05}`);
        }
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
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
                                    style={{outline: chosenItems.includes(index) ? 'solid 1px rgba(255, 255, 255, 0.9)' : 'none', cursor: "pointer"}}
                                    onClick={() => addToCart(index, item)}
                                >
                                    <img className='marketItemImg' src={item.image} alt='' />
                                    <a className='marketItemClass'>{item.class}</a>
                                    <a className='marketItemName'>{item.name}</a>
                                    <div className='marketItemCostContainer'>
                                        <img className='marketCoinImg' src={coin} alt='' />
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
                        style={{boxShadow: chosenSide === 'black' ? '0 2px 15px rgba(0, 0, 0, 0.9)' : 'none'}}
                    />
                    <img
                        className='chooseSideImg'
                        src={tails} alt=''
                        style={{boxShadow: chosenSide === 'red' ? '0 2px 15px rgba(153, 0, 0, 0.9)' : 'none'}}
                    />
                </div>
                <button className='btnCreateGame' disabled={playerItems.length === 0} onClick={() => betItems()}>
                    Join Game
                </button>
            </div>
        </div>
    )
}

export default observer(JoinModal);