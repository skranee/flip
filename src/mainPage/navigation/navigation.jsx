import React, {useContext, useRef, useState} from 'react'
import logoNav from './logo.png'
import {Context} from "../../index";
import {observer} from "mobx-react";
import { IoExitOutline } from "react-icons/io5/index.esm";
import {useNavigate} from "react-router-dom";
import gem from '../../imgs/currImg.png'
import LoginModal from "../loginModal/loginModal";
import coin from "../../imgs/currImg.png";
import CryptoDeposit from "../../cryptoDeposit/cryptoDeposit";
import AddressWindow from "../../cryptoDeposit/addressWindow";
import WithdrawWindow from "../../withdrawWindow/withdrawWindow";
import ConnectModal from "../../connectModal/connectModal";

function NavigationPanel () {
    const {globalStore, store} = useContext(Context)
    const navigate = useNavigate()
    const modalRef = useRef();
    const [clickInside, setClickInside] = useState(false);

    const handleLogin = () => {
        globalStore.setLogOpen(true);
    }

    if(store.isLoading) {
        return (
            <div className='loaderBackground'>
                <div className='loader'></div>
            </div>
        )
    }

    const handleLogout = async () => {
        await store.logout();
        handleNavigate('/');
        localStorage.removeItem('username');
        localStorage.removeItem('avatarUrl');
    }

    const handleNavigate = (path) => {
        navigate(path)
    }

    const openDeposit = async () => {
        await store.getUserItems(store.user.id);
        globalStore.setDepositOpen(true);
    }

    const handleCrypto = () => {
        globalStore.setDepositOpen(false);
        globalStore.setCryptoOpen(true);
    }

    const handleWithdraw = () => {
        globalStore.setDepositOpen(false);
        globalStore.setWithdrawOpen(true);
    }

    const handleDeposit = () => {
        globalStore.setDepositOpen(false);
        globalStore.setConnectModal(true);
    }

    const handleMouseDown = (event) => {
        if (modalRef.current && modalRef.current.contains(event.target)) {
            setClickInside(true)
        }
        else {
            setClickInside(false);
        }
    };

    const handleMouseUp = () => {
        if(clickInside) {
            globalStore.setDepositOpen(true);
        }
        else {
            globalStore.setDepositOpen(false)
            setClickInside(false)
        }
    };

    return (
        <div className='navigation'>
            {(store.user && !store.user.banned) && <ConnectModal />}
            {globalStore.logOpen && <LoginModal />}
            <img src={logoNav} className='logoNavigation' alt='' onClick={() => handleNavigate('/')} />
            {store.isAuth ?
                <div className='loggedNavContainer'>
                    {(store.user && !store.user.banned) &&
                        <div className='balanceNavContainer' onClick={openDeposit}>
                            <img className='marketCoinImg' src={gem} alt='' style={{width: 14, height: 14}}/>
                            <span className='balanceNav'>{store.user.balance}</span>
                        </div>
                    }
                    <img src={localStorage.getItem('avatarUrl')} className='avatarNav' alt=''
                         onClick={() => handleNavigate('/profile')}/>
                    <span className='profileNavText'
                       onClick={() => handleNavigate('/profile')}>{localStorage.getItem('username')}
                    </span>
                    <IoExitOutline className='exitIconNav' onClick={handleLogout} />
                </div>
            :
                <button className='loginBtn' onClick={() => handleLogin()}>
                    Login
                </button>
            }
            {
                globalStore.withdrawOpen && <WithdrawWindow />
            }
            {
                globalStore.cryptoOpen && <CryptoDeposit />
            }
            {
                globalStore.addressWindow && <AddressWindow />
            }
            {globalStore.depositOpen &&
                <div className='backgroundModal' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                    <div className='modalWindowDeposit' ref={modalRef}>
                        <div className='depositUpper'>
                            <div className='worthDeposit'>
                                <img src={gem} className='gemWorth' alt='' />
                                <span className='depositWorth'>
                                    {
                                        store.itemsList && store.user && store.itemsList.length ?
                                        Math.round(store.itemsList.reduce((a, b) => a + b.price, 0)) :
                                            0
                                    }
                                </span>
                            </div>
                            <span className='totalItemsDeposit'>Items amount: {store.itemsList.length}</span>
                        </div>
                        <div className='depositInventory'>
                            {store.itemsList.length ?
                                store.itemsList.map((item, index) => (
                                    <li key={index}
                                        className='marketItemContainer'
                                        style={{width: 'calc(40% - 15px)', height: 215}}
                                    >
                                        <img className='marketItemImg' src={item.image} alt='' />
                                        <span className='marketItemName'>{item.name}</span>
                                        <div className='marketItemCostContainer'>
                                            <img className='marketCoinImg' src={coin} alt='' />
                                            <span className='marketItemCost'>{Math.round(item.price)}</span>
                                        </div>
                                    </li>
                                )) :
                                <div className='marketItemContainer'
                                     style={
                                    {
                                        flexBasis: '100%',
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "default",
                                        pointerEvents: "none",
                                        minHeight: 250
                                    }}>
                                    <span className='noItemsText'>No items yet...</span>
                                </div>
                            }
                        </div>
                        <div className='depositButtons'>
                            <button className='depositBtn' onClick={handleCrypto}>
                                Get Gems
                            </button>
                            <button className='depositBtn' onClick={handleWithdraw}>
                                Withdraw items
                            </button>
                            <button className='depositBtn' onClick={handleDeposit}>
                                Deposit items
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default observer(NavigationPanel);