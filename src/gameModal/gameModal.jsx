import React, {useContext} from "react";
import ItemsList from "./itemsList";
import {observer} from "mobx-react";
import {Context} from "../index";

function GameModal({game}) {
    const {globalStore} = useContext(Context)
    const handleBlur = () => {
        globalStore.setViewOpen(false)
    }

    return (
        <div className='backgroundModal' onClick={() => handleBlur()}>
            <div className='modalWindow' style={{width: '55%',height: '55%'}} onClick={(event) => event.stopPropagation()}>
                <div className='lobbyPlayerContainer'>
                    <img className='lobbyAvatar' src={game.player1.avatar} alt=''/>
                    <a className='lobbyUsername'>{game.player1.name}</a>
                    <a className='lobbyWorthText'></a>
                    <a className='lobbyWorth'></a>
                    <div className='lobbyPlayerBet'>
                        <a className='lobbyChance'></a>
                        <a className='lobbyBet'></a>
                    </div>
                    <ItemsList items={''} />
                </div>
                <div className='lobbyPlayerContainer' style={{left: '81%'}}>
                    <img className='lobbyAvatar' src={game.player2.avatar} alt=''/>
                    <a className='lobbyUsername'>{game.player2.name}</a>
                    <a className='lobbyWorthText'></a>
                    <a className='lobbyWorth'></a>
                    <div className='lobbyPlayerBet'>
                        <a className='lobbyChance'></a>
                        <a className='lobbyBet'></a>
                    </div>
                    <ItemsList items={''} />
                </div>
            </div>
        </div>
    )
}

export default observer(GameModal);