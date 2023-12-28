import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import ruby from '../imgs/expImg.png'
import {items} from "../mainPage/playzone/gamesInfo";

export const maxExp = 2000;

function Rewards() {
    const {store} = useContext(Context)
    const [reward, setReward] = useState({name: '', lvl: 0, description: 'Bonus', image: ''})

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
    });

    const progressStatus = (store.user.experience / maxExp) * 100;

    // const add = async () => {
    //     await store.addItem(store.user.robloxId, items[4])
    // }

    return (
        <div>
            <div className='background' />
            <div className='rewardsPage'>
                <div className='rewardsContainer'>
                    {/*<button onClick={add}>*/}
                    {/*    add*/}
                    {/*</button>*/}
                    <div className='expInfo'>
                        <a>Level: {store.user.lvl}</a>
                        <a>Current experience: {store.user.experience}</a>
                    </div>
                    <div className='rewardDiv'>
                        <a className='nextRew'>NEXT REWARD</a>
                        <img className='rewardImg' src={reward.image} alt=''/>
                        <div className='rewardName'>
                            {reward.description !== 'Bonus' && <a>+{reward.description}</a>}
                            <a>{reward.name}</a>
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