import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'
import {observer} from "mobx-react";
import { IoCopySharp } from "react-icons/io5";

function AddressWindow() {
    const {globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setCryptoAddress('Waiting...');
        globalStore.setAddressWindow(false);
    }

    const copy = () => {
        navigator.clipboard.writeText(globalStore.crAddress);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalWindowAddress' onClick={(event) => event.stopPropagation()}>
                <span className='explainTextAddress'>
                    Use this address to make payments using crypto. Your addresses remain the same. You can deposit as many times as you want using this addresses.
                </span>
                <span className='currRateText'>Current rate: 1$ = 75 <img src={gem} style={{width: 11, height: 11}} className='gemHistory' alt='' /></span>
                <div className='addressContainer'>
                    <span className='aboveAddress'>Wallet address (You are able to use it multiple times)</span>
                    <div className='addressStringContainer'>
                        <input
                            type='text'
                            value={globalStore.crAddress}
                            className='addressInput'
                            readOnly
                        />
                        <IoCopySharp className='iconCopy' onClick={() => copy()} />
                    </div>
                </div>
                <span className='beneathAddress'>After depositing, you can close this tab and wait for your crypto payment to be processed</span>
            </div>
        </div>
    )
}

export default observer(AddressWindow);