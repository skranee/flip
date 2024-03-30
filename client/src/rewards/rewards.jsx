import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'
import {observer} from "mobx-react";

export const maxExp = 2000;

function Rewards() {
    const {globalStore, store} = useContext(Context)
    const [reward, setReward] = useState({})

    useEffect(() => {
        const getReward = async () => {
            store.setLoading(true);
            if(store.user) {
                const rew = await store.getReward();
                if(rew && rew.data) {
                    setReward(rew.data);
                }
            }
        }
        getReward();
        store.setLoading(false)
    }, [store, store.user.lvl]);

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
                        <span>Level: {store.user.lvl}</span>
                        <span>Current experience: {store.user.experience}</span>
                    </div>
                    <div className='rewardDiv'>
                        <span className='nextRew'>NEXT REWARD</span>
                        <img className='rewardImg' src={gem} alt=''/>
                        <div className='rewardName'>
                            <span>{reward.name} (+{reward.gemsAmount})</span>
                        </div>
                        <div className='progressBackground'>
                            <div className='progressBar' style={{width: `${progressStatus}%`}} />
                        </div>
                        <div className='progressInfo'>
                            <span className='rewardLvl'>Reward level: {reward.lvl}</span>
                            <span className='toNewLvl'>New Level: +{maxExp - store.user.experience}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(Rewards);