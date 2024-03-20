import React, {useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react";
import Playzone from "./playzone/playzone";
import GameModal from "../gameModal/gameModal";
import JoinModal from "../joinModal/joinModal";

function MainPage() {
    const {globalStore} = useContext(Context);

    return (
        <div>
            {globalStore.viewOpen ? <GameModal game={globalStore.gameInfo}/> : <div />}
            {globalStore.joinOpen && <JoinModal game={globalStore.gameInfo} />}
            <div className='background' />
            <div className='mainPage'>
                <Playzone />
            </div>
        </div>
    )
}

export default observer(MainPage);