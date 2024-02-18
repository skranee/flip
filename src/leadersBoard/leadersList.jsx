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
    }, []);

    return (
        <div className='leadersSpace'>
            {leaders.map((item, index) => (
                <li className='leaderContainer' key={index}>
                    <div className='leaderUserInfo'>
                        <img className='leaderImg' src={item.avatar} alt=''/>
                        <a className='leaderUsername'>{item.username}</a>
                    </div>
                    <div className='leaderTotal'>
                        <a className='totalUpper'>Total wagered</a>
                        <a style={{color: 'rgba(255, 255, 255, 0.92)', textShadow: '0 2px 8px rgba(255, 255, 255, 0.7)'}}>{Math.round(item.totalWagered)} <img src={gem} className='gemWorth' alt='' /></a>
                    </div>
                    <div className='leaderTotal'>
                        <a className='totalUpper'>Games played</a>
                        <a style={{color: 'rgba(255, 255, 255, 0.92)', textShadow: '0 2px 8px rgba(255, 255, 255, 0.7)'}}>{item.gamesPlayed}</a>
                    </div>
                    <div className='leaderTotal'>
                        <a className='totalUpper'>Level</a>
                        <a style={{color: 'rgba(255, 255, 255, 0.92)', textShadow: '0 2px 8px rgba(255, 255, 255, 0.7)'}}>{item.lvl}</a>
                    </div>
                </li>
            ))}
        </div>
    )
}

export default LeadersList;