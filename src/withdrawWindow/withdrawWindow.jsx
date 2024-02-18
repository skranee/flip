import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";
import coin from "../imgs/currImg.png";
import {currProp} from "../market/market";

function WithdrawWindow() {
    const {store, globalStore} = useContext(Context);
    const [playerItems, setPlayerItems] = useState(store.itemsList);
    const [chosenIndex, setChosenIndex] = useState([]);
    const [chosenItems, setChosenItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [approximate, setApproximate] = useState(0);
    const [errorMes, setErrorMes] = useState('No items to bet...');
    const [btnDisabled, setBtnDisabled] = useState(true);

    useEffect(() => {
        if(chosenItems.length) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [chosenItems]);

    const handleBlur = () => {
        globalStore.setWithdrawOpen(false);
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

    const addToQueue = async () => {
        const items = chosenItems.map(({name, itemId, price}) => ({
            name,
            itemId,
            value: price
        }))
        const add = await store.addToQueue(store.user.robloxId, items);
        if(add.status === 200) {
            console.log('Successfully added to queue');
            globalStore.setWithdrawOpen(false);
        }
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
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
                                    style={{
                                        outline: chosenIndex.includes(index) ? 'solid 1px rgba(255, 255, 255, 0.9)' : 'none',
                                        cursor: "pointer",
                                        flexBasis: "calc(42% - 5px)"
                                    }}
                                    onClick={() => addToCart(index, item)}
                                >
                                    <img className='marketItemImg' src={item.image} alt='' />
                                    <a className='marketItemClass'>{item.classification}</a>
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
                <button className='btnAdminDone' disabled={btnDisabled} onClick={addToQueue}>
                    Withdraw
                </button>
            </div>
        </div>
    )
}

export default observer(WithdrawWindow);