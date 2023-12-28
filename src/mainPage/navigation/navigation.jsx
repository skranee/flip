import React, {useContext} from 'react'
import logoNav from './logo.png'
import {Context} from "../../index";
import {observer} from "mobx-react";
import { IoExitOutline } from "react-icons/io5/index.esm";
import {useNavigate} from "react-router-dom";
import coin from '../../imgs/currImg.png'
import LoginModal from "../loginModal/loginModal";

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

    return (
        <div className='navigation'>
            {globalStore.logOpen && <LoginModal />}
            <img src={logoNav} className='logoNavigation' alt='' onClick={() => handleNavigate('/')} />
            {store.isAuth ?
                <div className='loggedNavContainer' onClick={() => handleNavigate('/profile')}>
                    <div className='balanceNavContainer'>
                        <img className='marketCoinImg' src={coin} alt='' style={{width: 14, height: 14}}/>
                        <a className='balanceNav'>{store.user.balance}</a>
                    </div>
                    <img src={localStorage.getItem('avatarUrl')} className='avatarNav' alt=''/>
                    <a className='profileNavText'>{localStorage.getItem('username')}</a>
                    <IoExitOutline className='exitIconNav' onClick={handleLogout} />
                </div>
            :
                <button className='loginBtn' onClick={() => handleLogin()}>
                    Login
                </button>
            }
        </div>
    )
}

export default observer(NavigationPanel);