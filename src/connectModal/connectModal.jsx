import React, {useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import online from '../../src/imgs/botOnline.png'
import offline from '../../src/imgs/botOffline.png'

const botsInfo = [
    {
        name: 'Bot1',
        robloxId: '123456789',
        image: 'image',
        status: 'online',
        serverUrl: 'https://www.youtube.com'
    },
    {
        name: 'Bot2',
        robloxId: '123456789',
        image: 'image',
        status: 'online',
        serverUrl: 'https://www.youtube.com'
    },
    {
        name: 'Bot3',
        robloxId: '123456789',
        image: 'image',
        status: 'offline',
        serverUrl: 'https://www.youtube.com'
    }
]

function ConnectModal() {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setConnectModal(false);
        globalStore.setWithdrawStatus('');
    }

    const handleConnect = (url) => {
        window.open(url);
    }

    return (
        <div className='backgroundModal' onClick={() => handleBlur()}>
            <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
                {globalStore.withdrawStatus &&
                    <a className='connectModalUpperText'>{globalStore.withdrawStatus}</a>
                }
                <a className='connectModalBotsText'>BOTS:</a>
                <div className='botsConnectContainer'>
                    <div className='botContainer'>
                        <img className='botAvatar' src={store.user.avatar} alt='' />
                        <a className='botUsername'>
                            {botsInfo[0].name} <img
                            style={{boxShadow: botsInfo[0].status === 'online' ? '0 0 4px rgba(127, 175, 95, 1)' : '0 0 4px rgba(170, 25, 11, 1)'}}
                            className='botStatus' src={botsInfo[0].status === 'online' ? online : offline} alt=''/>
                        </a>
                        <button className='btnBotConnect' onClick={() => handleConnect(botsInfo[0].serverUrl)}>
                            Connect
                        </button>
                    </div>
                    <div className='botContainer'>
                        <img className='botAvatar' src={store.user.avatar} alt=''/>
                        <a className='botUsername'>
                            {botsInfo[1].name} <img
                            style={{boxShadow: botsInfo[1].status === 'online' ? '0 0 4px rgba(127, 175, 95, 1)' : '0 0 4px rgba(170, 25, 11, 1)'}}
                            className='botStatus' src={botsInfo[1].status === 'online' ? online : offline} alt=''/>
                        </a>
                        <button className='btnBotConnect' onClick={() => handleConnect(botsInfo[1].serverUrl)}>
                            Connect
                        </button>
                    </div>
                    <div className='botContainer'>
                        <img className='botAvatar' src={store.user.avatar} alt=''/>
                        <a className='botUsername'>
                            {botsInfo[2].name} <img
                            style={{boxShadow: botsInfo[2].status === 'online' ? '0 0 4px rgba(127, 175, 95, 1)' : '0 0 4px rgba(170, 25, 11, 1)'}}
                            className='botStatus' src={botsInfo[2].status === 'online' ? online : offline} alt=''/>
                        </a>
                        <button className='btnBotConnect' onClick={() => handleConnect(botsInfo[2].serverUrl)}>
                            Connect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(ConnectModal);