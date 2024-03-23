import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function LeadersList() {
    const {store} = useContext(Context);
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const getBoard = async () => {
            const board = await store.getLeaders();
            setLeaders(board.data);
        }
        getBoard();
    }, [store]);

    const convertToK = (number) => {
        if(number < 1000) {
            return `${number}`
        }
        else if(number >= 1000 && number < 1000000) {
            const fixed = (number / 1000).toFixed(1);
            return `${fixed} K`
        }
        else if(number > 1000000) {
            const fixed = (number / 1000000).toFixed(2);
            return `${fixed} KK`
        }
    }

    return (
        <div className='leadersSpace'>
            {leaders.map((item, index) => (
                <li className='leaderContainer' key={index}>
                    <div className='leaderUserInfo'>
                        <img className='leaderImg' src={item.avatar} alt=''/>
                        <span className='leaderUsername'>{item.username}</span>
                    </div>
                    <div className='leaderTotal'>
                        <span className='totalUpper'>Total wagered</span>
                        <span style={{color: 'rgba(255, 255, 255, 0.92)'}}>{convertToK(Math.round(item.totalWagered))} <img src={gem} className='gemWorth' alt='' /></span>
                    </div>
                    <div className='leaderTotal'>
                        <span className='totalUpper'>Games played</span>
                        <span style={{color: 'rgba(255, 255, 255, 0.92)'}}>{item.gamesPlayed}</span>
                    </div>
                    <div className='leaderTotal'>
                        <span className='totalUpper'>Level</span>
                        <span style={{color: 'rgba(255, 255, 255, 0.92)'}}>{item.lvl}</span>
                    </div>
                </li>
            ))}
        </div>
    )
}

export default LeadersList;