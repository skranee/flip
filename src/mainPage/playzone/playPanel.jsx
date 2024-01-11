import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import { RiArrowDownSLine } from "react-icons/ri/index.esm";
import { RiArrowUpSLine } from "react-icons/ri/index.esm";
import DropdownSortAll from "./dropdownSortAll";
import DropdownSortHL from "./dropdownSortHL";
import {observer} from "mobx-react";
function PlayPanel () { //observable?
    const {store, globalStore} = useContext(Context)
    const [openSortHL, setOpenSortHL] = useState(false)
    const [openSortAll, setOpenSortAll] = useState(false)

    useEffect(() => {
        if(openSortAll) {
            setOpenSortHL(false)
        }
    }, [openSortHL]);

    useEffect(() => {
        if(openSortHL) {
            setOpenSortAll(false)
        }
    }, [openSortAll]);

    useEffect(() => {
        const getGames = async () => {
            const games = await store.getGames();
            if(games && games.data) {
                globalStore.setGamesAll(games.data.length);
                const join = games.data.filter(game => game.status === 'Joinable')
                globalStore.setGamesJoin(join.length);
            }
        }
        getGames();
    }, []);

    const paramsHL = ['Sort', 'High To Low', 'Low To High']
    const paramsAll = ['All', 'Ongoing', 'Joinable']

    const handleOpenHL = () => {
        setOpenSortHL(!openSortHL)
    }

    const handleOpenAll = () => {
        setOpenSortAll(!openSortAll)
    }

    return (
        <div className='playPanel'>
            <div className='gamesInfo'>
                <a>
                    All Games <br />
                    {globalStore.gamesAll}
                </a>
                <a>
                    Joinable Games <br />
                    {globalStore.gamesJoin}
                </a>
            </div>
            <div className='sortParamsSpace'>
                <div className='sortParams' onClick={handleOpenHL}>
                    <p className='sortFields' >{globalStore.titleHL}</p>
                    {!openSortHL ? <RiArrowDownSLine className='arrowPlayPanel' /> :
                        <RiArrowUpSLine className='arrowPlayPanel' />}
                    {openSortHL ? <DropdownSortHL params={paramsHL} /> : <div />}
                </div>
                <div className='sortParams' onClick={handleOpenAll}>
                    <p className='sortFields' >{globalStore.titleAll}</p>
                    {!openSortAll ? <RiArrowDownSLine className='arrowPlayPanel' /> :
                        <RiArrowUpSLine className='arrowPlayPanel' />}
                    {openSortAll ? <DropdownSortAll params={paramsAll}/> : <div />}
                </div>
            </div>
        </div>
    )
}

export default observer(PlayPanel);