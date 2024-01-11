import React, {useContext, useEffect, useState} from "react";
import PlayPanel from "./playPanel";
import GamesList from "./gamesList";
import {observer} from "mobx-react";
import GameCreate from "./gameCreate";
import {Context} from "../../index";
import History from "./history";
import {useNavigate} from "react-router-dom";

function Playzone () {
    const {store, globalStore} = useContext(Context);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        if(store.user && store.user.id && store.isAuth) {
            const his = async () => {
                const response = await store.getHistory(store.user.id);
                if(response && response.data) {
                    setHistory(response.data);
                }
            }
            his();
        }
    }, []);

    const handleCreate = () => {
        globalStore.setCreateOpen(true);
    }

    const handleHistory = async () => {
        const response = await store.getHistory(store.user.id);
        if(response && response.data) {
            setHistory(response.data);
        }
        globalStore.setHistoryOpen(true)
    }

    const openGames = () => {
        globalStore.setHistoryOpen(false);
    }

    return (
        <>
            <div className='playZone'>
                <PlayPanel />
                <div className='btnsPanel'>
                    <button className='btnPlaceBet' onClick={openGames}>
                        GAMES
                    </button>
                    <button className='btnPlaceBet' style={{background: '#8F8F8F'}} onClick={handleCreate}>
                        BET ITEMS
                    </button>
                    <button className='btnPlaceBet' style={{background: '#192432'}} onClick={handleHistory}>
                        HISTORY
                    </button>
                </div>

                {!globalStore.historyOpen &&
                    <GamesList />
                }
                {globalStore.historyOpen &&
                    <History history={history}/>
                }
            </div>
            {globalStore.createOpen &&
                <GameCreate />
            }
        </>
    )
}

export default observer(Playzone);