import React, {useContext, useEffect, useState} from "react";
import PlayPanel from "./playPanel";
import GamesList from "./gamesList";
import {observer} from "mobx-react";
import GameCreate from "./gameCreate";
import {Context} from "../../index";
import History from "./history";

function Playzone () {
    const {store, globalStore} = useContext(Context);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if(store.user && store.user.id && store.isAuth) {
            const his = async () => {
                const response = await store.getHistory(store.user.id);
                if(response && response.data) {
                    setHistory(response.data.reverse());
                }
            }
            his();
        }
    }, [store]);

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

    const handleCreate = () => {
        globalStore.setCreateOpen(true);
    }

    const handleHistory = async () => {
        const response = await store.getHistory(store.user.id);
        if(response && response.data) {
            setHistory(response.data.reverse());
        }
        globalStore.setHistoryOpen(true)
    }

    const openGames = () => {
        globalStore.setHistoryOpen(false);
    }

    return (
        <>
            <div className='playZone' style={{
                width: containerWidth(),
                marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
            }}>
                <PlayPanel />
                <div className='btnsPanel'>
                    <button className='btnPlaceBet' onClick={openGames}>
                        GAMES
                    </button>
                    <button className='btnPlaceBet btnPlaceBetGray' style={{background: '#8F8F8F'}} onClick={handleCreate}>
                        BET ITEMS
                    </button>
                    <button className='btnPlaceBet btnPlaceBetDarkBlue' style={{background: '#192432'}} onClick={handleHistory}>
                        HISTORY
                    </button>
                </div>

                {!globalStore.historyOpen &&
                    <GamesList />
                }
                {globalStore.historyOpen &&
                    <History history={history} />
                }
            </div>
            {globalStore.createOpen &&
                <GameCreate />
            }
        </>
    )
}

export default observer(Playzone);