import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import { FaPenSquare } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import PaymentsModal from "../paymentsModal/paymentsModal";
import gem from '../imgs/currImg.png'
import { FaCheck } from "react-icons/fa6";

// const clientUrl = 'http://localhost:3000'

function Profile() {
    const {store, globalStore} = useContext(Context);
    const [afUsers, setAfUsers] = useState(0);
    const [afBalance, setAfBalance] = useState(0);
    const [afCode, setAfCode] = useState('-');
    const [codeToUse, setCodeToUse] = useState('-');
    // const afLink = `${clientUrl}/a/${afCode}`
    const [change, setChange] = useState(false);
    const [changeCodeToUse, setChangeCodeToUse] = useState(false);
    const [value, setValue] = useState(afCode);
    const [valueCodeToUse, setValueCodeToUse] = useState(codeToUse);
    const [errorCode, setErrorCode] = useState('')
    const [errorCodeToUse, setErrorCodeToUse] = useState('');
    const [errorBalance, setErrorBalance] = useState('');

    useEffect(() => {
        const getAffiliate = async () => {
            if (store.user && store.user.id) {
                store.setLoading(true);
                const system = await store.getAffiliate(store.user.id);
                if (system && system.data) {
                    setAfUsers(system.data.affiliatedUsers);
                    setAfBalance(system.data.affiliatedBalance);
                    setAfCode(system.data.affiliateCode);
                    store.setCode(system.data.affiliateCode);
                    setValue(system.data.affiliateCode);
                }
                const linkedCode = await store.getLinkedCode(store.user.id);
                if(linkedCode && linkedCode.data) {
                    setCodeToUse(linkedCode.data.linkedCode);
                    setValueCodeToUse(linkedCode.data.linkedCode);
                }
            }
        }
        getAffiliate();
        store.setLoading(false);
    }, [store, store.user]);

    const handleCode = () => {
        setChange(true);
    }

    const handleCodeToUse = () => {
        setChangeCodeToUse(true);
    }

    const handleCancel = () => {
        setChange(false);
        setErrorCode('');
    }

    const handleCancelCodeToUse = () => {
        setChangeCodeToUse(false);
        setErrorCodeToUse('');
    }

    const convertToK = (number) => {
        if(number < 1000) {
            return `${number}`
        }
        else if(number >= 1000 && number < 1000000) {
            const fixed = (number / 1000).toFixed(1);
            return `${fixed} K`
        }
        else if(number > 1000000) {
            const fixed = (number / 1000000).toFixed(2);
            return `${fixed} KK`
        }
    }

    const handleSave = async () => {
        if(value !== afCode) {
            const create = await store.createAffiliate(value, store.user.id);
            if(create && create.data && create.data.status === 400) {
                setErrorCode('This code is already taken');
            }
            if(create && create.data && create.data.affiliateCode) {
                setAfCode(value);
                setChange(false);
                setErrorCode('');
            }
        }
        else {
            setErrorCode('Create a different code');
        }
    }

    const handleSaveCodeToUse = async () => {
        if(valueCodeToUse !== codeToUse && valueCodeToUse !== afCode) {
            const link = await store.linkLinkedCode(valueCodeToUse, store.user.id);
            if(link.data.status === 400) {
                setErrorCodeToUse('This code does not exist');
            }
            if(link.data.linkedCode) {
                setCodeToUse(valueCodeToUse);
                setChangeCodeToUse(false);
                setErrorCodeToUse('');
            }
        } else {
            if(valueCodeToUse === codeToUse) {
                setErrorCodeToUse('Link a different code');
            }
            if(valueCodeToUse === afCode) {
                setErrorCodeToUse('You can not use your own code');
            }
        }
    }

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    const openPayments = () => {
        globalStore.setPaymentsOpen(true);
    }

    const handleChangeCodeToUse = (event) => {
        setValueCodeToUse(event.target.value);
    }

    const getAffiliatedBalance = async () => {
        const affiliate = await store.getAffiliate(store.user.id);
        if(affiliate && affiliate.data) {
            const balance = affiliate.data.affiliatedBalance;
            if(balance > 150) {
                await store.getBalance(store.user.id);
                await store.checkAuth();
            } else {
                setErrorBalance('The amount of gems must be more than 150');
            }
        }
    }

    return (
        <div>
            <div className='background' />
            <div className='profilePage'>
                {globalStore.paymentsOpen && <PaymentsModal />}
                <div className='profileContainer'>
                    {store.isAuth &&
                        <>
                            <div className='profileInfo'>
                                <div className='innerInfoContainer'>
                                    <img className='avatarProfile' src={localStorage.getItem('avatarUrl')} alt=''/>
                                    <div className='innerData'>
                                        <span className='usernameProfile'>{store.user.username}</span>
                                        <span className='registerDate'>Registration date: {store.user.regDate}</span>
                                        <span className='userID'>Roblox ID: {store.user.robloxId}</span>
                                    </div>
                                </div>
                                <div className='outerInfoContainer'>
                                    <div className='fieldContainerProfile'>
                                        <span className='outerInfo'>Games played:</span>
                                        <span className='outerInfoNum'>{store.user.gamesPlayed}</span>
                                    </div>
                                    <div className='fieldContainerProfile'>
                                        <span className='outerInfo'>Total wagered:</span>
                                        <span className='outerInfoNum'>{convertToK(Math.round(store.user.totalWagered))} <img
                                            src={gem} className='gemBuy' alt=''/></span>
                                    </div>
                                    <div className='fieldContainerProfile'>
                                        <span className='outerInfo'>Total withdrawn:</span>
                                        <span className='outerInfoNum'>{convertToK(Math.round(store.user.totalWithdrawn))} <img
                                            src={gem} className='gemBuy' alt=''/></span>
                                    </div>
                                    <div className='fieldContainerProfile'>
                                        <span className='outerInfo'>Total deposited:</span>
                                        <span className='outerInfoNum'>{convertToK(Math.round(store.user.totalDeposited))} <img
                                            src={gem} className='gemBuy' alt=''/></span>
                                    </div>
                                    <button className='btnPayments' onClick={() => openPayments()}>Payments</button>
                                </div>
                            </div>
                            <div className='affiliateInfo'>
                                <div className='fieldContainerProfile'>
                                    <span className='affiliatedInfo'>Affiliated users</span>
                                    <span className='affiliatedInfoNum'>{afUsers}</span>
                                </div>
                                <div className='fieldContainerProfile'>
                                    <div className='affiliatedBalanceInfo'>
                                        <span className='affiliatedInfo'>Affiliated balance</span>
                                        <button className='btnGetBalance' onClick={getAffiliatedBalance}>
                                            Get
                                        </button>
                                    </div>
                                    <span className='affiliatedInfoNum'>{afBalance}</span>
                                    {errorBalance !== '' &&
                                        <div className='affiliatedBalanceInfo'>
                                    <span className='errorCode'>
                                        {errorBalance}
                                    </span>
                                            <button className='btnCheckError' onClick={() => setErrorBalance('')}>
                                                <FaCheck/>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className='fieldContainerProfile'>
                                    <span className='affiliatedInfo'>Affiliate code</span>
                                    <div>
                                        {change ?
                                            <>
                                                <div className='codeContainer'>
                                                    <input
                                                        className='afCode'
                                                        type='text'
                                                        value={value}
                                                        onChange={(event) => handleChange(event)}
                                                        maxLength='15'
                                                        minLength='3'
                                                    />
                                                    <FaSave className='btnSave' onClick={handleSave}/>
                                                    <MdOutlineCancelPresentation className='btnCancel'
                                                                                 onClick={() => handleCancel()}/>
                                                    {errorCode &&
                                                        <span className='errorCode'>{errorCode}</span>
                                                    }
                                                </div>
                                            </>
                                            :
                                            <div className='codeContainer'>
                                                <span className='affiliatedInfoNum'>{afCode}</span>
                                                <FaPenSquare className='btnPen' onClick={() => handleCode()}/>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {/*<div className='fieldContainerProfile'>*/}
                                {/*    <span className='affiliatedInfo'>Affiliate link</span>*/}
                                {/*    <span*/}
                                {/*        className='affiliatedInfoNum'*/}
                                {/*        style={{*/}
                                {/*            border: 'solid 2px rgba(110, 110, 110, 0.5)',*/}
                                {/*            borderRadius: 5,*/}
                                {/*            padding: 5*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        {afLink}*/}
                                {/*    </span>*/}
                                {/*</div>*/}
                                <div className='fieldContainerProfile'>
                                    <span className='affiliatedInfo'>Code for payments</span>
                                    <div>
                                        {changeCodeToUse ?
                                            <>
                                                <div className='codeContainer'>
                                                    <input
                                                        className='afCode'
                                                        type='text'
                                                        value={valueCodeToUse}
                                                        onChange={(event) => handleChangeCodeToUse(event)}
                                                        maxLength='15'
                                                        minLength='3'
                                                    />
                                                    <FaSave className='btnSave' onClick={handleSaveCodeToUse}/>
                                                    <MdOutlineCancelPresentation className='btnCancel'
                                                                                 onClick={() => handleCancelCodeToUse()}/>
                                                    {errorCodeToUse &&
                                                        <span className='errorCode'>{errorCodeToUse}</span>
                                                    }
                                                </div>
                                            </>
                                            :
                                            <div className='codeContainer'>
                                                <span className='affiliatedInfoNum'>{codeToUse}</span>
                                                <FaPenSquare className='btnPen' onClick={() => handleCodeToUse()}/>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {!store.isAuth &&
                        <span style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '1.2em',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textShadow: '0 0 4px rgba(255, 255, 255, 0.45)'
                        }}>
                            Authorize first...
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}

export default observer(Profile);