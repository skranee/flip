import React, {useState} from 'react';
import videoRed from '../imgs/coinFlipRed.webm'
import videoGrey from '../imgs/coinFlipGrey.webm'
import {observer} from "mobx-react";

const CoinFlip = ({game}) => {
    const defineWinColor = () => {
        if(game.result && game.result === 'First player won') {
            return first === 'red' ? 'red' : 'grey';
        } else if(game.result && game.result === 'Second player won') {
            return second === 'red' ? 'red' : 'grey';
        }
    }

    const first = game.side1;
    const second = game.side2 ? game.side2 : '';
    const winColor = useState(defineWinColor());

    const defineVideo = () => {
        return winColor === 'red' ? videoRed : videoGrey;
    }
    const outcome = defineVideo();

    return (
        <>
            <div id="coin-container">
                <video autoPlay={!!game.result} className='side-a'>
                    <source src={outcome} type="video/mp4"/>
                </video>
            </div>
        </>
    );
};

export default observer(CoinFlip);
