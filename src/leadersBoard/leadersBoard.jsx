import React from 'react';
import {observer} from "mobx-react";
import { FaMedal } from "react-icons/fa6";
import LeadersList from "./leadersList";

function LeadersBoard() {
    return (
        <div>
            <div className='background' />
            <div className='weeklyRacePage'>
                <div className='weeklyRaceContainer'>
                    <div className='leadersText'>
                        <FaMedal />
                        <a>Leaders</a>
                    </div>
                    <LeadersList />
                </div>
            </div>
        </div>
    )
}

export default observer(LeadersBoard);