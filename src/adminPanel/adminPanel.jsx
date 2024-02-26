import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {FaMedal} from "react-icons/fa6";
import LeadersList from "../leadersBoard/leadersList";
import {observer} from "mobx-react";
import OptionsList from "./optionsList";
import PaymentsList from "../paymentsModal/paymentsList";

function AdminPanel() {
    const {store, globalStore} = useContext(Context);
    const [username, setUsername] = useState('');
    const [value, setValue] = useState('');
    const [isDisabled, setIsDisabled] = useState(false); //setDisabled methods
    const [roleCheck, setRoleCheck] = useState('');
    const [incDec, setIncDec] = useState('increase')
    const [payments, setPayments] = useState([]);
    const [banState, setBanState] = useState('ban');

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
        globalStore.setAdminModal(false);
    }

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleValue = (event) => {
        setValue(event.target.value);
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
                    const change = await store.addBalance(store.user.id, username, parseInt(value));
                    setValue('');
                    globalStore.setAdminModal(false);
                } else if(globalStore.adminOptionStatus === 'BALANCE REDUCE') {
                    const change = await store.reduceBalance(store.user.id, username, parseInt(value));
                    setValue('');
                    globalStore.setAdminModal(false);
                } else if(globalStore.adminOptionStatus === 'LEVEL MANAGEMENT') {
                    const change = await store.changeLevel(store.user.id, username, parseInt(value));
                    setValue('');
                    globalStore.setAdminModal(false);
                }
            }
        } else if(globalStore.adminOptionStatus === 'ONLINE MANAGEMENT') {
            if(incDec === 'increase') {
                const change = await store.increaseOnline(parseInt(value));
                setValue('');
                globalStore.setAdminModal(false);
            } else if(incDec === 'decrease') {
                const change = await store.decreaseOnline(parseInt(value));
                setValue('');
                globalStore.setAdminModal(false);
            }
        } else if(globalStore.adminOptionStatus === 'ROLE CHANGE') {
            const change = await store.changeRole(store.user.id, username, roleCheck);
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

    return (
        <>
            {globalStore.paymentsOpen &&
                <div className='backgroundModal' onClick={handleBlurPayments}>
                    <div
                        className='modalWindowDeposit'
                        style={{justifyContent: "flex-start"}}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <a className='upperTextPayments'>{username.toUpperCase()}'S PAYMENTS</a>
                        <div className='paymentsSpace'>
                            <PaymentsList payments={payments} />
                        </div>
                    </div>
                </div>
            }
            {globalStore.adminModal &&
                <div className='backgroundModal' onClick={handleBlur}>
                    <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()} onKeyDown={(event) => handleKeyDown(event)}>
                        <a className='optionStatus'>{globalStore.adminOptionStatus}</a>
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
                                <a className='labelAdmin'>USERNAME</a>
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
                            (   globalStore.adminOptionStatus === 'BALANCE ADD' ||
                                globalStore.adminOptionStatus === 'BALANCE REDUCE' ||
                                globalStore.adminOptionStatus === 'BAN / UNBAN' ||
                                globalStore.adminOptionStatus === 'LEVEL MANAGEMENT' ||
                                globalStore.adminOptionStatus === 'ONLINE MANAGEMENT') &&
                            <div className='inputLabelAdmin'>
                                <a className='labelAdmin'>VALUE</a>
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
                                <a
                                    className={`incDecChoice ${incDec === 'increase' ? 'chosen' : ''}`}
                                    onClick={() => handleIncDec('increase')}
                                >
                                    Increase
                                </a>
                                <a
                                    className={`incDecChoice ${incDec === 'decrease' ? 'chosen' : ''}`}
                                    onClick={() => handleIncDec('decrease')}
                                >
                                    Decrease
                                </a>
                            </div>
                        }
                        {
                            globalStore.adminOptionStatus === 'BAN / UNBAN' &&
                            <div className='roleChoose'>
                            </div>
                        }
                        <button className='btnAdminDone' disabled={isDisabled} onClick={handleProceed}>
                            DONE
                        </button>
                    </div>
                </div>
            }
            <div className='background' />
            {store.user.role === 'admin' &&
                <div className='mainContentPage'>
                    <div className='mainContentContainer'
                         style={{
                             width: containerWidth(),
                             marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                         }}>
                        <div className='adminOptions'>
                            <OptionsList />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default observer(AdminPanel);