import React, {useContext} from 'react';
import {observer} from "mobx-react";
import question from "../../imgs/question.png";
import curr from '../../imgs/currImg.png'
import {Context} from "../../index";

function History({history}) {
    const {store} = useContext(Context);

    const handleResult = (ex, res) => {
        if(res === 'First player won') {
            if(store.user.id === ex.player1._id) {
                return 'WIN'
            } else {
                return 'LOSS'
            }
        } else {
            if(store.user.id === ex.player2._id) {
                return 'WIN'
            } else {
                return 'LOSS'
            }
        }
    }

    return (
        <ul className='gamesListSpace'>
            {history.map((item, index) => (
                <li className='gameContainer' key={index}>
                    <div className='imgsVs'>
                        <img className='playerGame' src={item.player1 ? item.player1.avatar : question} alt='' />
                        <span className='vs'> vs </span>
                        <img className='playerGame' src={item.player2 ? item.player2.avatar : question} alt='' style={{border: 'solid 2px #FF2D2D'}}/>
                    </div>
                    <span className='historyInfo'>
                        {item.date}
                    </span>
                    <span
                        className='historyInfo'
                        style={{color: handleResult(item, item.result) === 'WIN' ? 'rgba(0, 133, 13, 0.9)' : 'rgba(133, 0, 0, 0.9)', flexBasis: '6%'}}
                    >
                        {handleResult(item, item.result)}
                    </span>
                    <div className='totalWorthHistory'>
                        <img className='gemHistory' src={curr} alt='' />
                        <span className='historyInfo'>
                            {item.totalWorth}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default observer(History);