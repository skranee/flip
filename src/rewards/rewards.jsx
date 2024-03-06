import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import ruby from '../imgs/expImg.png'

export const maxExp = 2000;

function Rewards() {
    const {globalStore, store} = useContext(Context)
    const [reward, setReward] = useState({})

    useEffect(() => {
        const getReward = async () => {
            store.setLoading(true);
            const lvl = Math.ceil(store.user.lvl / 5) * 5;
            if(lvl) {
                const rew = await store.getReward(lvl);
                if(rew && rew.data) {
                    setReward(rew.data);
                }
            }
        }
        getReward();
        store.setLoading(false)
    }, [store.user.lvl]);

    const containerWidth = () => {
        if(!globalStore.chatOpened && globalStore.panelOpen) {
            return '84.5%'
        }
        else if(!globalStore.chatOpened && !globalStore.panelOpen) {
            return '97.5%'
        }
        else if(globalStore.chatOpened && !globalStore.panelOpen) {
            return '81%'
        }
        else {
            return '68%'
        }
    }

    const progressStatus = (store.user.experience / maxExp) * 100;

    return (
        <div>
            <div className='background' />
            <div className='rewardsPage'>
                <div className='rewardsContainer' style={{
                    width: containerWidth(),
                    marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                }}>
                    <div className='expInfo'>
                        <a>Level: {store.user.lvl}</a>
                        <a>Current experience: {store.user.experience}</a>
                    </div>
                    <div className='rewardDiv'>
                        <a className='nextRew'>NEXT REWARD</a>
                        <img className='rewardImg' src={reward.image} alt=''/>
                        <div className='rewardName'>
                            <a>{reward.name} (+{reward.gemsAmount})</a>
                        </div>
                        <div className='progressBackground'>
                            <div className='progressBar' style={{width: `${progressStatus}%`}} />
                        </div>
                        <div className='progressInfo'>
                            <a className='rewardLvl'>Reward level: {reward.lvl}</a>
                            <a className='toNewLvl'>New Level: +{maxExp - store.user.experience}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(Rewards);