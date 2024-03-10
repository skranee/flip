import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import online from '../imgs/botOnline.png'
import offline from '../imgs/botOffline.png'
import { FaCheckCircle } from "react-icons/fa";

function ConnectModal() {
    const {store, globalStore} = useContext(Context);
    const [botsInfo, setBotsInfo] = useState([]);
    const [inQueue, setInQueue] = useState(false);

    useEffect(() => {
        const getBots = async () => {
            const bots = await store.getBots();
            const queue = await store.getWithdrawData();
            if(queue && queue.data) {
                const included = queue.data.filter(item => item.userId === store.user.robloxId)[0];
                if(included) {
                    setInQueue(true);
                    globalStore.setBotRecommended(included.botName);
                } else {
                    setInQueue(false);
                    globalStore.setBotRecommended('');
                }
            } else {
                setInQueue(false);
            }
            if(bots && bots.data) {
                setBotsInfo(bots.data);
            }
        }
        getBots();
    }, [globalStore.connectModal, store, globalStore, ]);

    const handleBlur = () => {
        globalStore.setConnectModal(false);
        globalStore.setWithdrawStatus('');
    }

    const handleConnect = (url) => {
        window.open(url);
    }

    const decideColorStatus = () => {
        if(globalStore.withdrawStatus === 'Successfully added to the queue!') {
            return '#00f040';
        }
        else if(globalStore.withdrawStatus === 'You are already in the queue'
            || globalStore.withdrawStatus === 'Could not add to the queue') {
            return '#ff0000';
        }
    }

    return (
        globalStore.connectModal &&
        <div className='backgroundModal' onClick={() => handleBlur()}>
            <div className='modalWindowAdmin' onClick={(event) => event.stopPropagation()}>
                {globalStore.withdrawStatus &&
                    <span className='connectModalUpperText' style={{color: decideColorStatus()}}>
                        {globalStore.withdrawStatus}
                    </span>
                }
                <span className='connectModalBotsText'>BOTS:</span>
                <div className='botsConnectContainer'>
                    <div className='botContainer'>
                        <img className='botAvatar' src={store.user.avatar} alt=''/>
                        <span className='botUsername'>
                            {botsInfo[0].name} <img
                            style={{boxShadow: botsInfo[0].status === 'online' ? '0 0 4px rgba(127, 175, 95, 1)' : '0 0 4px rgba(170, 25, 11, 1)'}}
                            className='botStatus' src={botsInfo[0].status === 'online' ? online : offline} alt=''/>
                            {
                                globalStore.botRecommended === botsInfo[0].name ? <FaCheckCircle className='botCheckIcon' /> : ''
                            }
                        </span>
                        <button className='btnBotConnect' onClick={() => handleConnect(botsInfo[0].serverUrl)}>
                            Connect
                        </button>
                    </div>
                    <div className='botContainer'>
                        <img className='botAvatar' src={store.user.avatar} alt=''/>
                        <span className='botUsername'>
                            {botsInfo[1].name} <img
                            style={{boxShadow: botsInfo[1].status === 'online' ? '0 0 4px rgba(127, 175, 95, 1)' : '0 0 4px rgba(170, 25, 11, 1)'}}
                            className='botStatus' src={botsInfo[1].status === 'online' ? online : offline} alt=''/>
                            {
                                globalStore.botRecommended === botsInfo[1].name ? <FaCheckCircle className='botCheckIcon' /> : ''
                            }
                        </span>
                        <button className='btnBotConnect' onClick={() => handleConnect(botsInfo[1].serverUrl)}>
                            Connect
                        </button>
                    </div>
                    <div className='botContainer'>
                        <img className='botAvatar' src={store.user.avatar} alt=''/>
                        <span className='botUsername'>
                            {botsInfo[2].name} <img
                            style={{boxShadow: botsInfo[2].status === 'online' ? '0 0 4px rgba(127, 175, 95, 1)' : '0 0 4px rgba(170, 25, 11, 1)'}}
                            className='botStatus' src={botsInfo[2].status === 'online' ? online : offline} alt=''/>
                            {
                                globalStore.botRecommended === botsInfo[2].name ? <FaCheckCircle className='botCheckIcon' /> : ''
                            }
                        </span>
                        <button className='btnBotConnect' onClick={() => handleConnect(botsInfo[2].serverUrl)}>
                            Connect
                        </button>
                    </div>
                </div>
                <span className='connectModalLowerText'>Enable your incoming trade requests in order to be able to trade with the bot</span>
                {inQueue &&
                    <span className='connectModalLowerText' style={{color: 'rgba(255, 255, 255, 0.7)'}}>
                        <FaCheckCircle className='botCheckIcon'/> - your items are waiting to be withdrawn from that bot
                    </span>
                }
            </div>
        </div>
    )
}

export default observer(ConnectModal);