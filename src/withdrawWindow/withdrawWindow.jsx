import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";
import coin from "../imgs/currImg.png";

function WithdrawWindow() {
    const {store, globalStore} = useContext(Context);
    const playerItems= store.itemsList;
    const [chosenIndex, setChosenIndex] = useState([]);
    const [chosenItems, setChosenItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const errorMes = 'No items to bet...';
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
            setTotalValue(prevState => prevState -= Math.round(item.price));
        } else {
            setChosenIndex((prevState) => prevState.concat(index));
            setChosenItems(prevState => prevState.concat(item));
            setTotalValue(prevState => prevState += Math.round(item.price));
        }
    }

    const addToQueue = async () => {
        const add = await store.addToQueue(store.user.robloxId, chosenItems);
        if(add.status === 200 && add.data && !add.data.status) {
            globalStore.setBotRecommended(add.data.botName);
            globalStore.setWithdrawStatus('Successfully added to the queue!')
            globalStore.setWithdrawOpen(false);
            globalStore.setConnectModal(true);
        } else {
            globalStore.setBotRecommended('');
            if(add.data && add.data.status === 400) {
                globalStore.setWithdrawStatus('You are already in the queue');
                globalStore.setWithdrawOpen(false);
                globalStore.setConnectModal(true);
            }
            else {
                globalStore.setWithdrawStatus('Could not add to the queue');
                globalStore.setWithdrawOpen(false);
                globalStore.setConnectModal(true);
            }
        }
    }

    const handleAddItems = () => {
        globalStore.setWithdrawOpen(false);
        globalStore.setConnectModal(true);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
                <div className='addItems'>
                    <div className='createWorth'>
                        <img className='marketCoinImg' src={coin} alt='' style={{height: 15, width: 15}}/>
                        <span>{Math.round(totalValue)}</span>
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
                                        width: '46%'
                                    }}
                                    onClick={() => addToCart(index, item)}
                                >
                                    <img className='marketItemImg' src={item.image} alt='' />
                                    <span className='marketItemName'>{item.name}</span>
                                    <div className='marketItemCostContainer'>
                                        <img className='marketCoinImg' src={coin} alt='' />
                                        <span className='marketItemCost'>{Math.round(item.price)}</span>
                                    </div>
                                </li>
                            )) :
                            <span className='errorBet'>{errorMes}</span>
                        }
                    </div>
                    {playerItems.length === 0 &&
                        <button className='btnAddItems' onClick={handleAddItems}>
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