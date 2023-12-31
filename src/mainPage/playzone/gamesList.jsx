import React, {useContext, useEffect, useState} from "react";
import {players} from "./gamesInfo";
import {items} from "./gamesInfo";
import {Context} from "../../index";
import {observer} from "mobx-react";
import question from '../../imgs/question.png'

export class Game {
    player1;
    player2;
    items1;
    items2;
    items;
    bet;
    gameId;
    status;

    constructor(obj) {
        this.player1 = obj.player1;
        this.player2 = obj.player2;
        this.items1 = obj.items1;
        this.items2 = obj.items2;
        this.items = this.combineItems();
        this.bet = this.combineBets();
        this.gameId = obj.gameId;
        this.status = obj.status;
    }

    combineItems() {
        return this.items1.concat(this.items2);
    }

    combineBets() {
        return this.items.reduce((a, b) => a + b.cost, 0);
    }
}

function GamesList () {
    const {store, globalStore} = useContext(Context)
    const [games, setGames] = useState([])
    const [gamesCopy, setGamesCopy] = useState([...games]);
    const [searchItem, setSearchItem] = useState('')
    const [searchArr, setSearchArr] = useState([])

    useEffect(() => {
        const getGames = async () => {
            const game = await store.getGames();
            if(game && game.data) {
                setGames([])
                game.data.map(item => {
                    const gameObj = new Game({
                        player1: item.player1,
                        player2: item.player2,
                        items1: item.items1,
                        items2: item.items2,
                        status: item.status,
                        gameId: item.gameId
                    })
                    setGames(prev => [...prev, gameObj]);
                })
            }
        }
        getGames();
    }, [])

    useEffect(() => {
        if(globalStore.titleHL === 'High To Low') {
            setGamesCopy(gamesCopy.slice().sort((a,b) => b.bet - a.bet));
        } else if(globalStore.titleHL === 'Low To High') {
            setGamesCopy(gamesCopy.slice().sort((a, b) => a.bet - b.bet));
        }
        else {
            setGamesCopy(gamesCopy.slice().sort())
        }
    }, [globalStore.titleHL, games]);

    useEffect(() => {
        if(globalStore.titleAll !== 'All') {
            if(globalStore.titleHL === 'High To Low') {
                if(searchItem.trim().length) {
                    setGamesCopy(searchArr.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status === globalStore.titleAll))
                }
                else {
                    setGamesCopy(games.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status === globalStore.titleAll))
                }
            }
            else if (globalStore.titleHL === 'Low To High') {
                if(searchItem.trim().length) {
                    setGamesCopy(searchArr.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status === globalStore.titleAll))
                }
                else {
                    setGamesCopy(games.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status === globalStore.titleAll))
                }
            }
            else {
                if(searchItem.trim().length) {
                    setGamesCopy(searchArr.slice().filter(item => item.status === globalStore.titleAll))
                }
                else {
                    setGamesCopy(games.slice().filter(item => item.status === globalStore.titleAll))
                }
            }
        }
        else {
            if(globalStore.titleHL === 'High To Low') {
                if(searchItem.trim().length) {
                    setGamesCopy(searchArr.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status))
                }
                else {
                    setGamesCopy(games.slice().sort((a,b) => b.bet - a.bet).filter(item => item.status))
                }
            }
            else if (globalStore.titleHL === 'Low To High') {
                if(searchItem.trim().length) {
                    setGamesCopy(searchArr.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status))
                }
                else {
                    setGamesCopy(games.slice().sort((a,b) => a.bet - b.bet).filter(item => item.status))
                }
            }
            else {
                if(searchItem.trim().length) {
                    setGamesCopy(searchArr.slice().filter(item => item.status))
                }
                else {
                    setGamesCopy(games.slice().filter(item => item.status))
                }
            }
        }
    }, [globalStore.titleAll, games])

    const handleChange = (item) => {
        setSearchItem(item);
        if(!item.length) {
            globalStore.setTitleAll('All')
            globalStore.setTitleHL('Sort')
            setGamesCopy(games.slice())
        }
    }

    const handleSearch = (event) => {
        if(event.key === 'Enter' && searchItem.trim().length) {
            while(searchArr.length) {
                searchArr.pop()
            }
            let bool = false;
            games.map((game) => {
                for (const item of game.items) {
                    if (item.name === searchItem) {
                        bool = true;
                        break;
                    }
                }
                if(bool === true) {
                    searchArr.push(game);
                    setSearchArr(searchArr)
                    bool = false;
                }
            })
            globalStore.setTitleAll('All')
            setGamesCopy(searchArr)
        }
    }

    const handleView = (game) => {
        globalStore.setGameInfo(game);
        globalStore.setViewOpen(true);
    }

    const handleJoin = (game) => {
        //...
    }

    return (
        <>
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
                {gamesCopy.length ? gamesCopy.map((item, index) => (
                    <li key={index} className='gameContainer'>
                        <div className='imgsVs'>
                            <img className='playerGame' src={item.player1 ? item.player1.avatar : question} alt='' />
                            <a className='vs'> vs </a>
                            <img className='playerGame' src={item.player2 ? item.player2.avatar : question} alt='' style={{border: 'solid 2px #FF2D2D'}}/>
                        </div>
                        <div className='items'>
                            <img className='itemCircle' src={item.items1[0].image} alt=''/>
                            {item.items1.length > 1 ?
                                <img className='itemCircle' src={item.items1[1].image} alt=''/>
                                : <div />}
                            {item.items1.length > 2 ?
                                <img className='itemCircle' src={item.items1[2].image} alt=''/>
                                : <div />}
                            {item.items1.length > 3 ?
                                <img className='itemCircle' src={item.items1[3].image} alt=''/>
                                : <div />}
                            {item.items1.length > 4 ? <a className='divItems'> + {item.items1.length - 4}</a> : <div />}
                        </div>
                        <a className='itemsAmount'>{item.items1.length} items</a>
                        <div className='betParams'>
                            <a className='betAmount'>{item.bet}R$</a>
                            <a className='joinableBet'>
                                {Math.round(item.bet * 0.95)}R$-{Math.round(item.bet * 1.05)}R$
                            </a>
                        </div>
                        <div className='btnsGame'>
                            <button className='joinGame' onClick={(item) => handleJoin(item)}>
                                JOIN
                            </button>
                            <button className='viewGame' onClick={() => handleView(item)}>
                                VIEW
                            </button>
                        </div>
                    </li>
                    )) : <a className='noGames'>No games yet...</a>}
            </ul>
        </>
    )
}

export default observer(GamesList);