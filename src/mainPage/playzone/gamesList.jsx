import React, {useContext, useEffect, useState} from "react";
import {players} from "./gamesInfo";
import {items} from "./gamesInfo";
import {Context} from "../../index";
import {observer} from "mobx-react";

const games = [
    {
        player1: players[0],
        player2: players[1],
        items: items,
        bet: 123,
        status: 'Ongoing'
    },
    {
        player1: players[2],
        player2: players[3],
        items: [items[1], items[0], items[3]],
        bet: 244,
        status: 'Ongoing'
    },
    {
        player1: players[4],
        player2: players[5],
        items: [items[2], items[4], items[5]],
        bet: 52,
        status: 'Joinable'
    },
    {
        player1: players[6],
        player2: players[7],
        items: [items[6], items[1], items[0]],
        bet: 999,
        status: 'Joinable'
    },
    {
        player1: players[0],
        player2: players[1],
        items: items,
        bet: 123,
        status: 'Ongoing'
    },
    {
        player1: players[2],
        player2: players[3],
        items: [items[1], items[0], items[3]],
        bet: 244,
        status: 'Joinable'
    },
    {
        player1: players[4],
        player2: players[5],
        items: [items[2], items[4], items[5]],
        bet: 52,
        status: 'Ongoing'
    },
    {
        player1: players[6],
        player2: players[7],
        items: [items[6], items[1], items[0]],
        bet: 999,
        status: 'Ongoing'
    },
]

function GamesList () {
    const {globalStore} = useContext(Context)
    const [gamesCopy, setGamesCopy] = useState([...games]);
    const [searchItem, setSearchItem] = useState('')

    useEffect(() => {
        if(globalStore.titleHL === 'High To Low') {
            setGamesCopy(gamesCopy.slice().sort((a,b) => b.bet - a.bet));
        } else if(globalStore.titleHL === 'Low To High') {
            setGamesCopy(gamesCopy.slice().sort((a, b) => a.bet - b.bet));
        }
    }, [globalStore.titleHL, games]);

    useEffect(() => {
        if(globalStore.titleAll === 'Joinable') {
            if(globalStore.titleHL === 'High To Low') {
                setGamesCopy(games.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status === 'Joinable'))
            }
            else if (globalStore.titleHL === 'Low To High') {
                setGamesCopy(games.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status === 'Joinable'))
            }
        }
        else if(globalStore.titleAll === 'Ongoing') {
            if(globalStore.titleHL === 'High To Low') {
                setGamesCopy(games.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status === 'Ongoing'))
            }
            else if (globalStore.titleHL === 'Low To High') {
                setGamesCopy(games.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status === 'Ongoing'))
            }
        }
        else if(globalStore.titleAll === 'All') {
            if(globalStore.titleHL === 'High To Low') {
                setGamesCopy(games.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status))
            }
            else if (globalStore.titleHL === 'Low To High') {
                setGamesCopy(games.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status))
            }
        }
    }, [globalStore.titleAll, games])

    const handleChange = (item) => {
        setSearchItem(item);
    }

    const handleSearch = (event) => {
        if(event.key === 'Enter') {

            setSearchItem('')
        }
    }

    return (
        <div>
            <div className='searchContainer'>
                <input
                    type='text'
                    className='itemSearch'
                    value={searchItem}
                    placeholder='Search for an item...'
                    onChange={(event) => handleChange(event.target.value)}
                    maxLength='35'
                    onKeyDown={(event) => handleSearch(event)}
                />
            </div>
            <ul className='gamesListSpace'>
                {gamesCopy.map((item, index) => (
                    <li key={index} className='gameContainer' style={{top: `${index * 15}%`}}>
                        <div className='imgsVs'>
                            <img className='playerGame' src={item.player1.avatar} alt='' />
                            <a className='vs'> vs </a>
                            <img className='playerGame' src={item.player2.avatar} alt='' style={{marginLeft: 95, border: 'solid 2px #FF2D2D'}}/>
                        </div>
                        <div className='items'>
                            <img className='itemCircle' src={item.items[0].image} alt=''/>
                            {item.items.length > 1 ?
                                <img className='itemCircle' src={item.items[1].image} alt='' style={{marginLeft: 30}}/>
                                : <div />}
                            {item.items.length > 2 ?
                                <img className='itemCircle' src={item.items[2].image} alt='' style={{marginLeft: 60}}/>
                                : <div />}
                            {item.items.length > 3 ?
                                <img className='itemCircle' src={item.items[3].image} alt='' style={{marginLeft: 90}}/>
                                : <div />}
                            {item.items.length > 4 ? <a className='divItems'> + {item.items.length - 4}</a> : <div />}
                        </div>
                        <a className='itemsAmount'>{item.items.length} items</a>
                        <a className='betAmount'>{item.bet}R$</a>
                        <a className='joinableBet'>
                            {Math.round(item.bet * 0.95)}R$-{Math.round(item.bet * 1.05)}R$
                        </a>
                        <button className='joinGame'>
                            JOIN
                        </button>
                        <button className='viewGame'>
                            VIEW
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default observer(GamesList);