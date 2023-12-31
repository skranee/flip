import React from 'react';
import {observer} from "mobx-react";
import question from "../../imgs/question.png";
import curr from '../../imgs/currImg.png'

function History({history}) {
    return (
        <ul className='gamesListSpace'>
            {history.map((item, index) => (
                <li className='gameContainer' key={index}>
                    <div className='imgsVs'>
                        <img className='playerGame' src={item.player1 ? item.player1.avatar : question} alt='' />
                        <a className='vs'> vs </a>
                        <img className='playerGame' src={item.player2 ? item.player2.avatar : question} alt='' style={{border: 'solid 2px #FF2D2D'}}/>
                    </div>
                    <a className='historyInfo'>
                        {item.date}
                    </a>
                    <a
                        className='historyInfo'
                        style={{color: item.result === 'win' ? 'rgba(0, 133, 13, 0.9)' : 'rgba(133, 0, 0, 0.9)', flexBasis: '6%'}}
                    >
                        {item.result}
                    </a>
                    <div className='totalWorthHistory'>
                        <img className='gemHistory' src={curr} alt='' />
                        <a className='historyInfo'>
                            {item.totalWorth}
                        </a>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default observer(History);