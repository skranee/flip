import React, {useState} from "react";
import PlayPanel from "./playPanel";
import GamesList from "./gamesList";
import {observer} from "mobx-react";

function Playzone () {

    return (
        <div className='playZone'>
            <PlayPanel />
            <div className='btnsPanel'>
                <button className='btnPlaceBet'>
                    PLACE BET
                </button>
                <button className='btnPlaceBet' style={{background: '#8F8F8F'}} >
                    BET ITEMS
                </button>
                <button
                    className='btnPlaceBet'
                    style={{background: '#192432'}}
                >
                    HISTORY
                </button>
            </div>

            <GamesList />
        </div>
    )
}

export default observer(Playzone);