import React, {useContext} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";
import { SiEthereum } from "react-icons/si";
import { SiLitecoin } from "react-icons/si";
import { SiBitcoinsv } from "react-icons/si";
import { SiTether } from "react-icons/si";

function CryptoDeposit() {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setCryptoOpen(false);
    }

    const handleCryptoSet = async (crypto) => {
        let address;
        globalStore.setCryptoOpen(false);
        globalStore.setAddressWindow(true);
        const response = await store.findAddress(store.user.id, crypto);
        if(response.data === null) {
            const ad = await store.createPaymentAddress(crypto, store.user.id);
            address = ad.data;
        } else {
            address = response.data;
        }
        globalStore.setCryptoAddress(address);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div
                className='modalWindowAdmin'
                onClick={(event) => event.stopPropagation()}
                style={{height: '40%'}}
            >
                <div className='adminOptions'>
                    <li
                        className='optionContainer'
                        style={{flexBasis: 'calc(28% - 10px)', height: '45%'}}
                        onClick={() => handleCryptoSet('BTC')}
                    >
                        <SiBitcoinsv className='iconAdmin' />
                        <a className='adminText'>BITCOIN</a>
                    </li>
                    <li
                        className='optionContainer'
                        style={{flexBasis: 'calc(28% - 10px)', height: '45%'}}
                        onClick={() => handleCryptoSet('ETH')}
                    >
                        <SiEthereum className='iconAdmin' />
                        <a className='adminText'>ETHEREUM</a>
                    </li>
                    <li
                        className='optionContainer'
                        style={{flexBasis: 'calc(28% - 10px)', height: '45%'}}
                        onClick={() => handleCryptoSet('LTC')}
                    >
                        <SiLitecoin className='iconAdmin' />
                        <a className='adminText'>LITECOIN</a>
                    </li>
                    <li
                        className='optionContainer'
                        style={{flexBasis: 'calc(28% - 10px)', height: '45%'}}
                        onClick={() => handleCryptoSet('USDT')}
                    >
                        <SiTether className='iconAdmin' />
                        <a className='adminText'>USDT(ERC20)</a>
                    </li>
                </div>
            </div>
        </div>
    )
}

export default observer(CryptoDeposit);