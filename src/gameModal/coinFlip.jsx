import React, { useState } from 'react';

const CoinFlip = () => {
    const [flipResult, setFlipResult] = useState('');

    const handleCoinClick = () => {
        const newFlipResult = Math.random();
        setFlipResult('');

        setTimeout(() => {
            if (newFlipResult <= 0.5) {
                setFlipResult('heads');
            } else {
                setFlipResult('tails');
            }
        }, 100);
    };

    return (
        <div>
            <div id="coin-container" className={flipResult} onClick={handleCoinClick}>
                <div className="side-a"></div>
                <div className="side-b"></div>
            </div>
        </div>
    );
};

export default CoinFlip;
