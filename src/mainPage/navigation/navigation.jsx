import React, {useContext} from 'react'
import logoNav from './logo.png'
import {Context} from "../../index";
import {observer} from "mobx-react";

function NavigationPanel () {
    const {globalStore} = useContext(Context)
    const {store} = useContext(Context)
    const handleLogin = () => {
        globalStore.setLogOpen(true);
    }


    return (
        <div className='navigation'>
            <img src={logoNav} className='logoNavigation' alt='' />
            {store.isAuth ?
                <div className='loggedNavContainer'>
                    <img src={localStorage.getItem('avatarUrl')} className='avatarNav' alt=''/>
                    <a className='profileNavText'>{localStorage.getItem('username')}</a>
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