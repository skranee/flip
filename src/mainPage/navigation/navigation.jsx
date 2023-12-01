import React, {useContext} from 'react'
import logoNav from './logo.png'
import {Context} from "../../index";

function NavigationPanel () {
    const {globalStore} = useContext(Context)
    const handleLogin = () => {
        globalStore.setLogOpen(true);
    }


    return (
        <div className='navigation'>
            <img src={logoNav} className='logoNavigation' alt='' />
            <button className='loginBtn' onClick={() => handleLogin()}>
                Login
            </button>
        </div>
    )
}

export default NavigationPanel;