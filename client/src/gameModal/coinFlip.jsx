import React, { useEffect, useRef } from 'react';
import videoRed from '../imgs/coinFlipRed.webm';
import videoGrey from '../imgs/coinFlipGrey.webm';
import { observer } from "mobx-react";

const CoinFlip = ({ game }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (game.result) {
            if (videoRef.current) {
                videoRef.current.play();
            }
        }
    }, [game.result]);

    const defineWinColor = () => {
        if (game.result && game.result === 'First player won') {
            return game.side1 === 'red' ? 'red' : 'grey';
        } else if (game.result && game.result === 'Second player won') {
            return game.side2 === 'red' ? 'red' : 'grey';
        }
    }

    const winColor = defineWinColor();

    const defineVideo = () => {
        return winColor === 'red' ? videoRed : videoGrey;
    }
    const outcome = defineVideo();

    return (
        <>
            <div id="coin-container">
                <video ref={videoRef} className='side-a'>
                    <source src={outcome} type="video/mp4" />
                </video>
            </div>
        </>
    );
};

export default observer(CoinFlip);