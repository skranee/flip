import React, {useContext, useEffect, useRef, useState} from 'react';
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
    const modalRef1 = useRef();
    const modalRef2 = useRef();
    const modalRef3 = useRef();
    const [clickInside1, setClickInside1] = useState(false);
    const [clickInside2, setClickInside2] = useState(false);
    const [clickInside3, setClickInside3] = useState(false);
    const [fake, setFake] = useState(0);
    const [taxReceiver, setTaxReceiver] = useState('');
    const [taxData, setTaxData] = useState({});
    const [newReceiver, setNewReceiver] = useState('');
    const [receiverDisabled, setReceiverDisabled] = useState(true);
    const [minutesReceiver, setMinutesReceiver] = useState('0');
    const [hoursReceiver, setHoursReceiver] = useState('0');
    const [daysReceiver, setDaysReceiver] = useState('0');

    useEffect(() => {
        const getInventory = async () => {
            const inventory = await store.getGiveawayItems(store.user.id);
            if(inventory && inventory.data) {
                setGiveawayInventory(inventory.data.sort((a, b) => b.price - a.price));
            }
        }
        getInventory();
    }, [globalStore.adminOptionStatus, store, ]);

    useEffect(() => {
        if(globalStore.adminOptionStatus === 'ONLINE MANAGEMENT') {
            const getFake = async () => {
                const fake = await store.getFake(store.user.id);
                if(fake && (fake.data === 0 || fake.data) && !fake.data.status) {
                    setFake(fake.data);
                }
            }
            getFake();
        }
        else if(globalStore.adminOptionStatus === 'TAX MANAGEMENT') {
            const getData = async () => {
                const response = await store.getTaxInfo(store.user.id);
                if(response && response.data) {
                    setTaxData(response.data);
                }
                const receiver = await store.getReceiver();
                if(receiver && receiver.data) {
                    setTaxReceiver(receiver.data);
                }
            }
            getData();
        }
    }, [globalStore.adminModal, ]);

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

    const handleMouseDown1 = (event) => {
        if (modalRef1.current && modalRef1.current.contains(event.target)) {
            setClickInside1(true)
        }
        else {
            setClickInside1(false);
        }
    };

    const handleMouseUp1 = () => {
        if(clickInside1) {
            globalStore.setPaymentsOpen(true);
        }
        else {
            globalStore.setPaymentsOpen(false)
            setClickInside1(false)
        }
    };

    const handleMouseDown2 = (event) => {
        if (modalRef2.current && modalRef2.current.contains(event.target)) {
            setClickInside2(true)
        }
        else {
            setClickInside2(false);
        }
    };

    const handleMouseUp2 = () => {
        if(clickInside2) {
            globalStore.setAdminModal(true);
        }
        else {
            setUsername('');
            setValue('');
            setLevel('');
            setNewReceiver('');
            globalStore.setAdminModal(false);
            setClickInside2(false)
        }
    };

    const handleMouseDown3 = (event) => {
        if (modalRef3.current && modalRef3.current.contains(event.target)) {
            setClickInside3(true)
        }
        else {
            setClickInside3(false);
        }
    };

    const handleMouseUp3 = () => {
        if(clickInside3) {
            globalStore.setAdminOptionStatus('GIVEAWAY')
        }
        else {
            globalStore.setAdminOptionStatus('');
            setChosenItems([]);
            setChosenIndex([]);
            setTimer(0);
            setGiveawayValue(0);
            setClickInside3(false)
        }
    };

    const handleChangeReceiver = (event) => {
        setNewReceiver(event.target.value);
        if(!event.target.value.trim().length) {
            setReceiverDisabled(true);
        } else {
            setReceiverDisabled(false);
        }
    }

    const handleProceedReceiver = async () => {
        const minutesInt = parseInt(minutesReceiver ? minutesReceiver : 0);
        const hoursInt = parseInt(hoursReceiver ? hoursReceiver : 0);
        const daysInt = parseInt(daysReceiver ? daysReceiver : 0);

        const minutesConverted = 1000 * 60 * minutesInt;
        const hoursConverted = 1000 * 60 * 60 * hoursInt;
        const daysConverted = 1000 * 60 * 60 * 24 * daysInt;

        const finalTimer = minutesConverted + hoursConverted + daysConverted;

        const change = await store.changeTaxReceiver(store.user.id, newReceiver, finalTimer);

        if(change && change.data && !change.data.status) {
            setUsername('');
            setValue('');
            setLevel('');
            setNewReceiver('');
            globalStore.setAdminModal(false);
            setClickInside2(false)
            globalStore.setErrorMessage('Success!');
            globalStore.setErrorWindow(true);
        } else {
            setUsername('');
            setValue('');
            setLevel('');
            setNewReceiver('');
            globalStore.setAdminModal(false);
            setClickInside2(false)
            globalStore.setErrorMessage('Something went wrong');
            globalStore.setErrorWindow(true);
        }
    }

    const cancelTaxChange = async () => {
        const response = await store.cancelTaxChange(store.user.id);
        if(response && response.data && response.data === 'success') {
            setUsername('');
            setValue('');
            setLevel('');
            setNewReceiver('');
            globalStore.setAdminModal(false);
            setClickInside2(false)
            globalStore.setErrorMessage('Success!');
            globalStore.setErrorWindow(true);
        } else {
            setUsername('');
            setValue('');
            setLevel('');
            setNewReceiver('');
            globalStore.setAdminModal(false);
            setClickInside2(false)
            globalStore.setErrorMessage('Cancellation failed!');
            globalStore.setErrorWindow(true);
        }
    }

    return (
        <>
            {globalStore.paymentsOpen &&
                <div className='backgroundModal' onMouseDown={handleMouseDown1} onMouseUp={handleMouseUp1}>
                    <div
                        className='modalWindowDeposit'
                        style={{justifyContent: "flex-start"}}
                        ref={modalRef1}
                    >
                        <span className='upperTextPayments'>{username.toUpperCase()}'S PAYMENTS</span>
                        <div className='paymentsSpace'>
                            <PaymentsList payments={payments}/>
                        </div>
                    </div>
                </div>
            }
            {globalStore.adminOptionStatus === 'GIVEAWAY' &&
                <div className='backgroundModal' onMouseDown={handleMouseDown3} onMouseUp={handleMouseUp3}>
                    <div className='modalWindowMain' ref={modalRef3}>
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
                <div className='backgroundModal' onMouseDown={handleMouseDown2} onMouseUp={handleMouseUp2}>
                    <div className='modalWindowAdmin' ref={modalRef2}
                         onKeyDown={(event) => handleKeyDown(event)}>
                        <span className='optionStatus'>{globalStore.adminOptionStatus}</span>
                        {
                            globalStore.adminOptionStatus === 'TAX MANAGEMENT' &&
                            <>
                                <div className='receiverContainer'>
                                    <span>Current receiver : </span>
                                    <span
                                        style={{color: 'rgba(255, 45, 45, 1)', textShadow: '0 0 4px rgba(255, 45, 45, 0.5)'}}
                                    >
                                        {taxReceiver ? taxReceiver : "Loading..."}
                                    </span>
                                </div>

                                {(taxReceiver && taxReceiver === 'almightyreno') &&
                                    <div className='tx_C_Container'>
                                        <span>Manage tax receiver</span>
                                        <input
                                            className='receiverInput'
                                            type='text'
                                            placeholder='Enter new receiver...'
                                            value={newReceiver}
                                            onChange={(event) => handleChangeReceiver(event)}
                                        />

                                        <div className='timerSetReceiver'>
                                            <div className='timerReceiverContainer'>
                                                <input
                                                    className='receiverInput'
                                                    type='text'
                                                    placeholder='Minutes...'
                                                    value={minutesReceiver}
                                                    style={{width: 50}}
                                                    onChange={(event) => setMinutesReceiver(event.target.value)}
                                                />
                                                <span className='textReceiverTimerSettings'>minutes</span>
                                            </div>
                                            <div className='timerReceiverContainer'>
                                                <input
                                                    className='receiverInput'
                                                    type='text'
                                                    placeholder='Hours...'
                                                    value={hoursReceiver}
                                                    style={{width: 50}}
                                                    onChange={(event) => setHoursReceiver(event.target.value)}
                                                />
                                                <span className='textReceiverTimerSettings'>hours</span>
                                            </div>
                                            <div className='timerReceiverContainer'>
                                                <input
                                                    className='receiverInput'
                                                    type='text'
                                                    placeholder='Days...'
                                                    value={daysReceiver}
                                                    style={{width: 50}}
                                                    onChange={(event) => setDaysReceiver(event.target.value)}
                                                />
                                                <span className='textReceiverTimerSettings'>days</span>
                                            </div>
                                        </div>

                                        <button className='btnAdminDone' disabled={receiverDisabled}
                                                onClick={() => handleProceedReceiver()}>
                                            Proceed
                                        </button>
                                    </div>
                                }

                                {(taxReceiver && taxReceiver !== 'almightyreno') &&
                                    <>
                                        <div className='taxDataContainer'>
                                            <div className='receiverContainer'
                                                 style={{
                                                     justifyContent: 'space-between',
                                                     width: '95%'
                                                 }}
                                            >
                                                <span>Who switched : </span>
                                                <span
                                                    style={{
                                                        color: 'rgba(255, 45, 45, 1)',
                                                        textShadow: '0 0 4px rgba(255, 45, 45, 0.5)'
                                                    }}
                                                >
                                                {taxData.adminChanged ? taxData.adminChanged : 'No data...'}
                                            </span>
                                            </div>
                                            <div className='receiverContainer'
                                                 style={{
                                                     justifyContent: 'space-between',
                                                     width: '95%'
                                                 }}
                                            >
                                                <span>Duration : </span>
                                                <span
                                                    style={{
                                                        color: 'rgba(255, 45, 45, 1)',
                                                        textShadow: '0 0 4px rgba(255, 45, 45, 0.5)'
                                                    }}
                                                >
                                                {taxData.givenFor ? taxData.givenFor : "No data..."}
                                            </span>
                                            </div>
                                            <div className='receiverContainer'
                                                 style={{
                                                     justifyContent: 'space-between',
                                                     width: '95%'
                                                 }}
                                            >
                                                <span>Ending : </span>
                                                <span
                                                    style={{
                                                        color: 'rgba(255, 45, 45, 1)',
                                                        textShadow: '0 0 4px rgba(255, 45, 45, 0.5)'
                                                    }}
                                                >
                                                {taxData.timeEnding ? taxData.timeEnding : "No data..."}
                                            </span>
                                            </div>
                                        </div>
                                        <button className='btnAdminDone' onClick={cancelTaxChange}>
                                            Cancel
                                        </button>
                                    </>
                                }
                            </>
                        }
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
                                <span
                                    className='labelAdmin'>{globalStore.adminOptionStatus === 'REWARD' ? 'GEMS AMOUNT' : 'VALUE'}</span>
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
                            <>
                                <div className='aUsers'>
                                    <span>Fake users:</span>
                                    <span className='aUsersAmount'>
                                        {fake}
                                    </span>
                                </div>
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
                            </>
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

                        {globalStore.adminOptionStatus !== 'TAX MANAGEMENT' &&
                            <button className='btnAdminDone' onClick={handleProceed}>
                                DONE
                            </button>
                        }
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