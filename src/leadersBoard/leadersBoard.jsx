import React, {useContext} from 'react';
import {observer} from "mobx-react";
import { FaMedal } from "react-icons/fa6";
import LeadersList from "./leadersList";
import {Context} from "../index";

function LeadersBoard() {
    const {globalStore} = useContext(Context);

    const containerWidth = () => {
        if(!globalStore.chatOpened && globalStore.panelOpen) {
            return '84.5%'
        }
        else if(!globalStore.chatOpened && !globalStore.panelOpen) {
            return '97.5%'
        }
        else if(globalStore.chatOpened && !globalStore.panelOpen) {
            return '81%'
        }
        else {
            return '68%'
        }
    }

    return (
        <div>
            <div className='background' />
            <div className='mainContentPage'>
                <div className='mainContentContainer'
                     style={{
                         width: containerWidth(),
                         marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                }}>
                    <div className='leadersText'>
                        <FaMedal />
                        <a>Leaderboard</a>
                    </div>
                    <LeadersList />
                </div>
            </div>
        </div>
    )
}

export default observer(LeadersBoard);