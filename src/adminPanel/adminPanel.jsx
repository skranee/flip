import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import OptionsList from "./optionsList";
import PaymentsList from "../paymentsModal/paymentsList";
import gem from '../imgs/currImg.png'
import {giveawayCreate} from "../chat/chat";

function AdminPanel() {
    const {store, globalStore} = useContext(Context);
    const [username, setUsername] = useState('');
    const [value, setValue] = useState('');
    const [level, setLevel] = useState('');
    const [roleCheck, setRoleCheck] = useState('');
    const [incDec, setIncDec] = useState('increase')
    const [payments, setPayments] = useState([]);
    const [banState, setBanState] = useState('ban');
    const [giveawayInventory, setGiveawayInventory] = useState([]);
    const [chosenItems, setChosenItems] = useState([]);
    const [chosenIndex, setChosenIndex] = useState([]);
    const [giveawayValue, setGiveawayValue] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const getInventory = async () => {
            const inventory = await store.getGiveawayItems(store.user.id);
            if(inventory && inventory.data) {
                setGiveawayInventory(inventory.data.sort((a, b) => b.price - a.price));
            }
        }
        getInventory();
    }, [globalStore.adminOptionStatus, store, ]);

    const containerWidth = () => {
        if(!globalStore.chatOpened && globalStore.panelOpen) {
            return '84.5%'
        }
        else if(!globalStore.chatOpened && !globalStore.panelOpen) {
            return '97.5%'
        }
        else if(globalStore.chatOpened && !globalStore.panelOpen) {
            return '81%'
        }
        else {
            return '68%'
        }
    }

    const handleBlur = () => {
        setUsername('');
        setValue('');
        setLevel('');
        globalStore.setAdminModal(false);
    }

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleValue = (event) => {
        setValue(event.target.value);
    }

    const handleLevel = (event) => {
        setLevel(event.target.value);
    }

    const handleKeyDown = async (event) => {
        if(event.key === 'Enter') {
            await handleProceed();
        }
    }

    const handleProceed = async () => {
        if(
            globalStore.adminOptionStatus === 'BALANCE ADD' ||
            globalStore.adminOptionStatus === 'BALANCE REDUCE' ||
            globalStore.adminOptionStatus === 'LEVEL MANAGEMENT') {
            if(username.trim().length && value.trim().length) {
                if(globalStore.adminOptionStatus === 'BALANCE ADD') {
                    await store.addBalance(store.user.id, username, parseInt(value));
                    setValue('');
                    globalStore.setAdminModal(false);
                } else if(globalStore.adminOptionStatus === 'BALANCE REDUCE') {
                    await store.reduceBalance(store.user.id, username, parseInt(value));
                    setValue('');
                    globalStore.setAdminModal(false);
                } else if(globalStore.adminOptionStatus === 'LEVEL MANAGEMENT') {
                    await store.changeLevel(store.user.id, username, parseInt(value));
                    setValue('');
                    globalStore.setAdminModal(false);
                }
            }
        } else if(globalStore.adminOptionStatus === 'ONLINE MANAGEMENT') {
            if(incDec === 'increase') {
                await store.increaseOnline(parseInt(value));
                setValue('');
                globalStore.setAdminModal(false);
            } else if(incDec === 'decrease') {
                await store.decreaseOnline(parseInt(value));
                setValue('');
                globalStore.setAdminModal(false);
            }
        } else if(globalStore.adminOptionStatus === 'BAN / UNBAN') {
            if(banState === 'ban') {
                await store.banUser(store.user.id, username);
                setUsername('');
                globalStore.setAdminModal(false);
            } else if(banState === 'unban') {
                await store.unbanUser(store.user.id, username);
                setUsername('');
                globalStore.setAdminModal(false);
            }
        }
        else if(globalStore.adminOptionStatus === 'ROLE CHANGE') {
            await store.changeRole(store.user.id, username, roleCheck);
            setRoleCheck('');
            globalStore.setAdminModal(false);
        } else if(globalStore.adminOptionStatus === 'PAYMENTS') {
            const user = await store.getUserAdmin(username);
            if(user && user.data) {
                const id = user.data._id;
                const payments = await store.getPayments(id);
                if(payments && payments.data) {
                    setPayments(payments.data);
                    globalStore.setAdminModal(false);
                    globalStore.setPaymentsOpen(true);
                }
            }
        } else if(globalStore.adminOptionStatus === 'REWARD') {
            const reward = await store.addReward('Gems', parseInt(level), parseInt(value));
            if(reward && reward.data) {
                setValue('');
                setLevel('');
                globalStore.setAdminModal(false);
            }
        }
    }

    const createGiveaway = () => {
        if(!chosenItems.length || !timer) {
            globalStore.setErrorMessage('Set all settings to create a giveaway');
            globalStore.setErrorWindow(true);
            globalStore.setAdminOptionStatus('');
        } else {
            const giveaway = {
                items: chosenItems,
                timer: timer,
                totalValue: giveawayValue
            }
            const message = {
                method: 'giveaway',
                giveaway: giveaway,
                giveawayStatus: true
            }
            giveawayCreate(message);
            setChosenItems([]);
            setChosenIndex([]);
            setTimer(0);
            setGiveawayValue(0);
            globalStore.setAdminOptionStatus('');
        }
    }

    const handleRoleCheck = (role) => {
        setRoleCheck(role);
    }

    const handleIncDec = (incDec) => {
        setIncDec(incDec)
    }

    const handleBlurPayments = () => {
        globalStore.setPaymentsOpen(false);
    }

    const addToGiveaway = (index, item) => {
        if(chosenIndex.includes(index)) {
            setChosenIndex(chosenIndex.filter(item => item !== index));
            setChosenItems(chosenItems.filter(chosenItem => chosenItem.itemId !== item.itemId));
            setGiveawayValue(prevState => prevState -= item.price);
        } else {
            setChosenIndex((prevState) => prevState.concat(index));
            setChosenItems(prevState => prevState.concat(item));
            setGiveawayValue(prevState => prevState += item.price);
        }
    }

    const handleBlurGiveaway = () => {
        globalStore.setAdminOptionStatus('');
        setChosenItems([]);
        setChosenIndex([]);
        setTimer(0);
        setGiveawayValue(0);
    }

    return (
        <>
            {globalStore.paymentsOpen &&
                <div className='backgroundModal' onClick={handleBlurPayments}>
                    <div
                        className='modalWindowDeposit'
                        style={{justifyContent: "flex-start"}}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <span className='upperTextPayments'>{username.toUpperCase()}'S PAYMENTS</span>
                        <div className='paymentsSpace'>
                            <PaymentsList payments={payments}/>
                        </div>
                    </div>
                </div>
            }
            {globalStore.adminOptionStatus === 'GIVEAWAY' &&
                <div className='backgroundModal' onClick={() => handleBlurGiveaway()}>
                    <div className='modalWindowMain' onClick={(event) => event.stopPropagation()}>
                        <span className='optionStatus'>
                            {globalStore.adminOptionStatus}
                        </span>
                        <div className='giveawayUpperInfo'>
                            <span className='giveawayChosenTotalValue'>
                            Total value: <img src={gem} className='gemWorth' alt='gem'/>{giveawayValue}
                        </span>
                            <span className='giveawayChosenAmount'>
                            Total items: {(chosenItems && chosenItems.length) ? chosenItems.length : 0}
                        </span>
                        </div>
                        <div className='inventoryContainer'>
                            {(giveawayInventory.length > 0) &&
                                giveawayInventory.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`inventoryItemContainer + ${chosenIndex.includes(index) ? 'chosenItem' : ''}`}
                                        onClick={() => addToGiveaway(index, item)}
                                        style={{outline: chosenIndex.includes(index) ? 'solid 1px rgba(255, 255, 255, 0.75)' : 'none'}}
                                    >
                                        <img
                                            className='imgItemContainer'
                                            src={item.image}
                                            alt={item.name}
                                        />
                                        <span className='nameItemContainer'>
                                            {item.name}
                                        </span>
                                        <span className='priceItemContainer'>
                                            <img src={gem} className='gemWorth' alt='gem'/>{Math.round(item.price)}
                                        </span>
                                    </li>
                                ))
                            }
                        </div>
                        <div className='timersContainer'>
                            <div
                                className={`chooseTimer + ${timer === 1000 * 60 * 5 ? 'chosenTimer' : ''}`}
                                onClick={() => setTimer(1000 * 60 * 5)}
                            >
                                5 Min
                            </div>
                            <div
                                className={`chooseTimer + ${timer === 1000 * 60 * 30 ? 'chosenTimer' : ''}`}
                                onClick={() => setTimer(1000 * 60 * 30)}
                            >
                                30 Min
                            </div>
                            <div
                                className={`chooseTimer + ${timer === 1000 * 60 * 60 * 2 ? 'chosenTimer' : ''}`}
                                onClick={() => setTimer(1000 * 60 * 60 * 2)}
                            >
                                2 Hours
                            </div>
                            <div
                                className={`chooseTimer + ${timer === 1000 * 60 * 60 * 10 ? 'chosenTimer' : ''}`}
                                onClick={() => setTimer(1000 * 60 * 60 * 10)}
                            >
                                10 Hours
                            </div>
                            <div
                                className={`chooseTimer + ${timer === 1000 * 60 * 60 * 24 ? 'chosenTimer' : ''}`}
                                onClick={() => setTimer(1000 * 60 * 60 * 24)}
                            >
                                24 Hours
                            </div>
                        </div>
                        <button className='btnAdminDone' onClick={createGiveaway}>
                        CREATE
                        </button>
                    </div>
                </div>
            }
            {globalStore.adminModal &&
                <div className='backgroundModal' onClick={handleBlur}>
                    <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}
                         onKeyDown={(event) => handleKeyDown(event)}>
                        <span className='optionStatus'>{globalStore.adminOptionStatus}</span>
                        {
                            (
                                globalStore.adminOptionStatus === 'ROLE CHANGE' ||
                                globalStore.adminOptionStatus === 'BALANCE ADD' ||
                                globalStore.adminOptionStatus === 'BALANCE REDUCE' ||
                                globalStore.adminOptionStatus === 'BAN / UNBAN' ||
                                globalStore.adminOptionStatus === 'LEVEL MANAGEMENT' ||
                                globalStore.adminOptionStatus === 'PAYMENTS'
                            ) &&

                            <div className='inputLabelAdmin'>
                                <span className='labelAdmin'>USERNAME</span>
                                <input
                                    type='text'
                                    className='inputAdmin'
                                    placeholder='Enter the username...'
                                    value={username}
                                    onChange={(event) => handleUsername(event)}
                                />
                            </div>
                        }
                        {
                            (globalStore.adminOptionStatus === 'REWARD') &&
                            <div className='inputLabelAdmin'>
                                <span className='labelAdmin'>LEVEL</span>
                                <input
                                    type='text'
                                    className='inputAdmin'
                                    placeholder='Enter the level...'
                                    value={level}
                                    onChange={(event) => handleLevel(event)}
                                />
                            </div>
                        }
                        {
                            (globalStore.adminOptionStatus === 'BALANCE ADD' ||
                                globalStore.adminOptionStatus === 'BALANCE REDUCE' ||
                                globalStore.adminOptionStatus === 'LEVEL MANAGEMENT' ||
                                globalStore.adminOptionStatus === 'ONLINE MANAGEMENT' ||
                                globalStore.adminOptionStatus === 'REWARD') &&
                            <div className='inputLabelAdmin'>
                                <span className='labelAdmin'>{globalStore.adminOptionStatus === 'REWARD' ? 'GEMS AMOUNT' : 'VALUE'}</span>
                                <input
                                    type='text'
                                    className='inputAdmin'
                                    placeholder='Enter the value...'
                                    value={value}
                                    onChange={(event) => handleValue(event)}
                                />
                            </div>
                        }
                        {
                            globalStore.adminOptionStatus === 'ROLE CHANGE' &&
                            <div className='roleChoose'>
                                <label className='labelRadio' onClick={() => handleRoleCheck('admin')}>
                                    <div
                                        className={`radioRole ${roleCheck === 'admin' ? 'checked' : ''}`}
                                    />
                                    Admin
                                </label>
                                <label className='labelRadio' onClick={() => handleRoleCheck('developer')}>
                                    <div
                                        className={`radioRole ${roleCheck === 'developer' ? 'checked' : ''}`}
                                    />
                                    Developer
                                </label>
                                <label className='labelRadio' onClick={() => handleRoleCheck('user')}>
                                    <div
                                        className={`radioRole ${roleCheck === 'user' ? 'checked' : ''}`}
                                    />
                                    User
                                </label>
                            </div>
                        }
                        {
                            globalStore.adminOptionStatus === 'ONLINE MANAGEMENT' &&
                            <div className='roleChoose'>
                                <span
                                    className={`incDecChoice ${incDec === 'increase' ? 'chosen' : ''}`}
                                    onClick={() => handleIncDec('increase')}
                                >
                                    Increase
                                </span>
                                <span
                                    className={`incDecChoice ${incDec === 'decrease' ? 'chosen' : ''}`}
                                    onClick={() => handleIncDec('decrease')}
                                >
                                    Decrease
                                </span>
                            </div>
                        }
                        {
                            globalStore.adminOptionStatus === 'BAN / UNBAN' &&
                            <div className='roleChoose'>
                                <span
                                    className={`incDecChoice ${banState === 'ban' ? 'chosen' : ''}`}
                                    onClick={() => setBanState('ban')}
                                >
                                    Ban
                                </span>
                                <span
                                    className={`incDecChoice ${banState === 'unban' ? 'chosen' : ''}`}
                                    onClick={() => setBanState('unban')}
                                >
                                    Unban
                                </span>
                            </div>
                        }
                        <button className='btnAdminDone' onClick={handleProceed}>
                            DONE
                        </button>
                    </div>
                </div>
            }
            <div className='background'/>
            {store.user.role === 'admin' &&
                <div className='mainContentPage'>
                    <div className='mainContentContainer'
                         style={{
                             width: containerWidth(),
                             marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                         }}>
                        <div className='adminOptions'>
                            <OptionsList/>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default observer(AdminPanel);