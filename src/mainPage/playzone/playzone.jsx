import React, {useState} from "react";
import PlayPanel from "./playPanel";
import GamesList from "./gamesList";
import {observer} from "mobx-react";

function Playzone () {

    return (
        <div>
            <PlayPanel />
            <button className='btnPlaceBet'>
                PLACE BET
            </button>
            <p className='splitBtns'>|</p>
            <button className='btnPlaceBet' style={{left: '55%', background: '#8F8F8F'}} >
                BET ITEMS
            </button>
            <button
                className='btnPlaceBet'
                style={{width: '13%', background: '#192432', left: '69.5%'}}
            >
                HISTORY
            </button>

            <GamesList />
        </div>
    )
}

export default observer(Playzone);