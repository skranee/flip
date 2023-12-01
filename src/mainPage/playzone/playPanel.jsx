import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import { RiArrowDownSLine } from "react-icons/ri/index.esm";
import { RiArrowUpSLine } from "react-icons/ri/index.esm";
import DropdownSortAll from "./dropdownSortAll";
import DropdownSortHL from "./dropdownSortHL";
function PlayPanel () { //observable?
    const {globalStore} = useContext(Context)
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

    const paramsHL = ['High To Low', 'Low To High']
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
                All Games <br />
                {globalStore.gamesAll}
            </div>
            <div className='gamesInfo' style={{left: '10%'}}>
                Joinable Games <br />
                {globalStore.gamesJoin}
            </div>
            <div className='sortParams' onClick={handleOpenHL}>
                {!openSortHL ? <RiArrowDownSLine className='arrowPlayPanel' /> :
                    <RiArrowUpSLine className='arrowPlayPanel' />}
                {openSortHL ? <DropdownSortHL params={paramsHL} /> : <div />}
                <p className='sortFields' >{globalStore.titleHL}</p>
            </div>
            <div className='sortParams' style={{left: '53%'}} onClick={handleOpenAll}>
                {!openSortAll ? <RiArrowDownSLine className='arrowPlayPanel' /> :
                    <RiArrowUpSLine className='arrowPlayPanel' />}
                {openSortAll ? <DropdownSortAll params={paramsAll}/> : <div />}
                <p className='sortFields' >{globalStore.titleAll}</p>
            </div>
        </div>
    )
}

export default PlayPanel;