import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'
import {observer} from "mobx-react";

function AddressWindow() {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setCryptoAddress('Waiting...');
        globalStore.setAddressWindow(false);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalWindowAddress' onClick={(event) => event.stopPropagation()}>
                <a className='explainTextAddress'>
                    Use this address to make payments using crypto. Your addresses remain the same. You can deposit as many times as you want using this addresses.
                </a>
                <a className='currRateText'>Current rate: 1$ = 300 <img src={gem} style={{width: 11, height: 11}} className='gemHistory' alt='' /></a>
                <div className='addressContainer'>
                    <a className='aboveAddress'>Wallet address (You are able to use it multiple times)</a>
                    <input
                        type='text'
                        value={globalStore.crAddress}
                        className='addressInput'
                        readOnly
                    />
                </div>
                <a className='beneathAddress'>After depositing, you can close this tab and wait for your crypto payment to be processed</a>
            </div>
        </div>
    )
}

export default observer(AddressWindow);