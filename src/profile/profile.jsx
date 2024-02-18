import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import { FaPenSquare } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import PaymentsModal from "../paymentsModal/paymentsModal";
import gem from '../imgs/currImg.png'
import { FaCheck } from "react-icons/fa6";

const clientUrl = 'http://localhost:3000'

function Profile() {
    const {store, globalStore} = useContext(Context);
    const [afUsers, setAfUsers] = useState(0);
    const [afBalance, setAfBalance] = useState(0);
    const [afCode, setAfCode] = useState('-');
    const [codeToUse, setCodeToUse] = useState('-');
    const afLink = `${clientUrl}/a/${afCode}`
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
                if (system.data) {
                    setAfUsers(system.data.affiliatedUsers);
                    setAfBalance(system.data.affiliatedBalance);
                    setAfCode(system.data.affiliateCode);
                    store.setCode(system.data.affiliateCode);
                    setValue(system.data.affiliateCode);
                }
                const linkedCode = await store.getLinkedCode(store.user.id);
                if(linkedCode.data) {
                    setCodeToUse(linkedCode.data.linkedCode);
                    setValueCodeToUse(linkedCode.data.linkedCode);
                }
            }
        }
        getAffiliate();
        store.setLoading(false);
    }, [store.user]);

    // const containerWidth = () => {
    //     if(!globalStore.chatOpened && globalStore.panelOpen) {
    //         return '84.5%'
    //     }
    //     else if(!globalStore.chatOpened && !globalStore.panelOpen) {
    //         return '97.5%'
    //     }
    //     else if(globalStore.chatOpened && !globalStore.panelOpen) {
    //         return '81%'
    //     }
    //     else {
    //         return '68%'
    //     }
    // }


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

    const handleSave = async () => {
        if(value !== afCode) {
            const create = await store.createAffiliate(value, store.user.id);
            if(create.data.status === 400) {
                setErrorCode('This code is already taken');
            }
            if(create.data.affiliateCode) {
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
                const getBalance = await store.getBalance(store.user.id);
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
                <div className='profileContainer' style={{
                    // width: containerWidth(),
                    // marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                }}>
                    <div className='profileInfo'>
                        <div className='innerInfoContainer'>
                            <img className='avatarProfile' src={localStorage.getItem('avatarUrl')} alt='' />
                            <div className='innerData'>
                                <a className='usernameProfile'>{store.user.username}</a>
                                <a className='registerDate'>Registration date: {store.user.regDate}</a>
                                <a className='userID'>Roblox ID: {store.user.robloxId}</a>
                            </div>
                        </div>
                        <div className='outerInfoContainer'>
                            <div className='fieldContainerProfile'>
                                <a className='outerInfo'>Games played:</a>
                                <a className='outerInfoNum'>{store.user.gamesPlayed}</a>
                            </div>
                            <div className='fieldContainerProfile'>
                                <a className='outerInfo'>Total wagered:</a>
                                <a className='outerInfoNum'>{Math.round(store.user.totalWagered)} <img src={gem} className='gemBuy' alt='' /></a>
                            </div>
                            <div className='fieldContainerProfile'>
                                <a className='outerInfo'>Total withdrawn:</a>
                                <a className='outerInfoNum'>{Math.round(store.user.totalWithdrawn)} <img src={gem} className='gemBuy' alt='' /></a>
                            </div>
                            <div className='fieldContainerProfile'>
                                <a className='outerInfo'>Total deposited:</a>
                                <a className='outerInfoNum'>{Math.round(store.user.totalDeposited)} <img src={gem} className='gemBuy' alt='' /></a>
                            </div>
                            <button className='btnPayments' onClick={() => openPayments()}>Payments</button>
                        </div>
                    </div>
                    <div className='affiliateInfo'>
                        <div className='fieldContainerProfile'>
                            <a className='affiliatedInfo'>Affiliated users</a>
                            <a className='affiliatedInfoNum'>{afUsers}</a>
                        </div>
                        <div className='fieldContainerProfile'>
                            <div className='affiliatedBalanceInfo'>
                                <a className='affiliatedInfo'>Affiliated balance</a>
                                <button className='btnGetBalance' onClick={getAffiliatedBalance}>
                                    Get
                                </button>
                            </div>
                            <a className='affiliatedInfoNum'>{afBalance}</a>
                            {errorBalance !== '' &&
                                <div className='affiliatedBalanceInfo'>
                                    <a className='errorCode'>
                                        {errorBalance}
                                    </a>
                                    <button className='btnCheckError' onClick={() => setErrorBalance('')}>
                                        <FaCheck />
                                    </button>
                                </div>
                            }
                        </div>
                        <div className='fieldContainerProfile'>
                            <a className='affiliatedInfo'>Affiliate code</a>
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
                                            <MdOutlineCancelPresentation className='btnCancel' onClick={() => handleCancel()}/>
                                            {errorCode &&
                                                <a className='errorCode'>{errorCode}</a>
                                            }
                                        </div>
                                    </>
                                    :
                                    <div className='codeContainer'>
                                        <a className='affiliatedInfoNum'>{afCode}</a>
                                        <FaPenSquare className='btnPen' onClick={() => handleCode()} />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='fieldContainerProfile'>
                            <a className='affiliatedInfo'>Affiliate link</a>
                            <a
                                className='affiliatedInfoNum'
                                style={{border: 'solid 2px rgba(110, 110, 110, 0.5)', borderRadius: 5, padding: 5}}
                            >
                                {afLink}
                            </a>
                        </div>
                        <div className='fieldContainerProfile'>
                            <a className='affiliatedInfo'>Code for payments</a>
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
                                            <MdOutlineCancelPresentation className='btnCancel' onClick={() => handleCancelCodeToUse()}/>
                                            {errorCodeToUse &&
                                                <a className='errorCode'>{errorCodeToUse}</a>
                                            }
                                        </div>
                                    </>
                                    :
                                    <div className='codeContainer'>
                                        <a className='affiliatedInfoNum'>{codeToUse}</a>
                                        <FaPenSquare className='btnPen' onClick={() => handleCodeToUse()} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(Profile);