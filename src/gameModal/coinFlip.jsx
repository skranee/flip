import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";

const CoinFlip = ({game}) => {
    const {store} = useContext(Context);
    const first = game.side1;
    const second = game.side2 ? game.side2 : '';
    const [flipResult, setFlipResult] = useState(
        game.player2 ?
            store.user.id === game.player1._id ? game.result === 'First player won' ? second :
                game.result === 'Second player won' ? first : '' : ''
            :
            ''
    );

    useEffect(() => {
        setTimeout(() => {
            if (game.result === 'First player won') {
                setFlipResult(second);
            } else if (game.result === 'Second player won'){
                setFlipResult(first);
            }
        }, 100);
    }, [game, ]);

    return (
        <div>
            <div id="coin-container" className={flipResult}>
                <div className="side-a"></div>
                <div className="side-b"></div>
            </div>
        </div>
    );
};

export default CoinFlip;
