import React, {useContext, useEffect} from 'react'
import logoNav from './logo.png'
import {Context} from "../../index";
import {observer} from "mobx-react";
import { IoExitOutline } from "react-icons/io5/index.esm";
import {useNavigate} from "react-router-dom";
import gem from '../../imgs/currImg.png'
import LoginModal from "../loginModal/loginModal";
import {currProp} from "../../market/market";
import coin from "../../imgs/currImg.png";
import CryptoDeposit from "../../cryptoDeposit/cryptoDeposit";
import AddressWindow from "../../cryptoDeposit/addressWindow";
import WithdrawWindow from "../../withdrawWindow/withdrawWindow";

function NavigationPanel () {
    const {globalStore, store} = useContext(Context)
    const navigate = useNavigate()

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
        const logout = await store.logout();
        handleNavigate('/');
        localStorage.removeItem('username');
        localStorage.removeItem('avatarUrl');
    }

    const handleNavigate = (path) => {
        navigate(path)
    }

    const openDeposit = () => {
        const items = store.getUserItems(store.user.id);
        globalStore.setDepositOpen(true);
    }

    const handleBlur = () => {
        globalStore.setDepositOpen(false);
    }

    const handleCrypto = () => {
        globalStore.setDepositOpen(false);
        globalStore.setCryptoOpen(true);
    }

    const handleWithdraw = () => {
        globalStore.setDepositOpen(false);
        globalStore.setWithdrawOpen(true);
    }

    return (
        <div className='navigation'>
            {globalStore.logOpen && <LoginModal />}
            <img src={logoNav} className='logoNavigation' alt='' onClick={() => handleNavigate('/')} />
            {store.isAuth ?
                <div className='loggedNavContainer'>
                    <div className='balanceNavContainer' onClick={openDeposit}>
                        <img className='marketCoinImg' src={gem} alt='' style={{width: 14, height: 14}}/>
                        <a className='balanceNav'>{store.user.balance}</a>
                    </div>
                    <img src={localStorage.getItem('avatarUrl')} className='avatarNav' alt='' onClick={() => handleNavigate('/profile')}/>
                    <a className='profileNavText' onClick={() => handleNavigate('/profile')}>{localStorage.getItem('username')}</a>
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
                <div className='backgroundModal' onClick={handleBlur}>
                    <div className='modalWindowDeposit' onClick={(event) => event.stopPropagation()}>
                        <div className='depositUpper'>
                            <div className='worthDeposit'>
                                <img src={gem} className='gemWorth' alt='' />
                                <a className='depositWorth'>
                                    {
                                        store.itemsList && store.user && store.itemsList.length ?
                                        Math.round(store.itemsList.reduce((a, b) => a + b.price, 0) / currProp) :
                                            0
                                    }
                                </a>
                            </div>
                            <a className='totalItemsDeposit'>Items amount: {store.itemsList.length}</a>
                        </div>
                        <div className='depositInventory'>
                            {store.itemsList.length ?
                                store.itemsList.map((item, index) => (
                                    <li key={index}
                                        className='marketItemContainer'
                                        style={{flexBasis: 'calc(45% - 15px)'}}
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
                                    <a className='noItemsText'>No items yet...</a>
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
                            <button className='depositBtn'>
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