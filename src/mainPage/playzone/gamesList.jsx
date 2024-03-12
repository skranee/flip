import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react";
import question from '../../imgs/question.png'
import gem from '../../imgs/currImg.png'
import { HiDotsHorizontal } from "react-icons/hi";

export class Game {
    player1;
    player2;
    items1;
    items2;
    items;
    gems1;
    gems2;
    bet;
    gameId;
    status;
    side1;
    side2;
    result;
    checkLink;

    constructor(obj) {
        this.player1 = obj.player1;
        this.player2 = obj.player2;
        this.items1 = obj.items1;
        this.items2 = obj.items2;
        this.items = this.combineItems();
        this.gems1 = obj.gems1;
        this.gems2 = obj.gems2;
        this.bet = this.combineBets();
        this.gameId = obj.gameId;
        this.status = obj.status;
        this.side1 = obj.side1;
        this.side2 = obj.side2;
        this.result = obj.result;
        this.checkLink = obj.checkLink;
    }

    combineItems() {
        return this.items1.concat(this.items2);
    }

    combineBets() {
        if(this.items1.length > 0) {
            return Math.round(this.items.reduce((a, b) => a + b.price, 0));
        } else {
            return Math.round(this.gems1);
        }
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
                        gameId: item.gameId,
                        side1: item.side1,
                        side2: item.side2,
                        gems1: item.gems1,
                        gems2: item.gems2,
                        result: item.result,
                        checkLink: item.checkLink
                    })
                    setGames(prev => [...prev, gameObj]);
                    return gameObj;
                })
            }
        }
        getGames();

        const intervalId = setInterval(getGames, 3000); //fix to 1s probably!!!!

        return () => clearInterval(intervalId);
    }, [store])

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
    }, [globalStore.titleAll, games, globalStore.titleHL, searchArr, searchItem])

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
                    if (item.name.toLowerCase() === searchItem.toLowerCase()) {
                        bool = true;
                        break;
                    }
                }
                if(bool === true) {
                    searchArr.push(game);
                    setSearchArr(searchArr)
                    bool = false;
                }
                return null;
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
        globalStore.setGameInfo(game);
        globalStore.setJoinOpen(true);
    }

    const cancel = async (game) => {
        await store.cancelGame(store.user, game);
        await store.checkAuth();
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
                            <img
                                className='playerGame'
                                src={item.player1 ? item.player1.avatar : question}
                                alt=''
                                style={{
                                    border: item.side1 === 'grey' ? 'solid 2px rgba(200, 200, 200, 1)' :
                                        'solid 2px rgba(255, 0, 0, 1)'
                                }}
                            />
                            <span className='vs'> vs </span>
                            {item.player2 ?
                                <img
                                    className='playerGame'
                                    src={item.player2.avatar}
                                    alt=''
                                    style={{
                                        border: item.side1 === 'red' ? 'solid 2px rgba(200, 200, 200, 1)' :
                                            'solid 2px rgba(239, 0, 0, 1)'
                                    }}
                                />
                                :
                                <div className='dotsPlayer2' style={{
                                    border: item.side1 === 'red' ? 'solid 2px rgba(200, 200, 200, 1)' :
                                        'solid 2px rgba(239, 0, 0, 1)'
                                }}>
                                    <HiDotsHorizontal style={{fontSize: '1.6em'}} />
                                </div>
                            }
                        </div>
                        {(item.items1 && item.items1.length > 0) ?
                            <>
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
                                    {item.items1.length > 4 ? <span className='divItems'> + {item.items1.length - 4}</span> : <span> </span>}
                                </div>
                                {item.items1 &&
                                    <span
                                        className='itemsAmount'>{item.items1.length} item{item.items1.length > 1 ? 's' : ''}
                                    </span>
                                }
                            </> :
                            <>
                            <div className='items' style={{flexBasis: '45%'}}>
                                    <span className='CWGtext'>Created With Gems</span>
                                </div>
                            </>
                        }
                        <div className='betParams'>
                            <span className='betAmount'>{item.bet} <img src={gem} className='gemWorth' style={{width: 12, height: 12}} alt='' /> </span>
                            <span className='joinableBet'>
                                {Math.round(item.bet * 0.9)}-{Math.round(item.bet * 1.1)}  <img src={gem} style={{width: 12, height: 12}} className='gemWorth' alt='' />
                            </span>
                        </div>
                        <div className='btnsGame'>
                            {item.status !== 'Ongoing' &&
                                (item.player1._id === store.user.id ?
                                        <button className='joinGame' onClick={() => cancel(item)}>
                                            CANCEL
                                        </button>
                                        :
                                        <button className='joinGame' onClick={() => handleJoin(item)}>
                                            JOIN
                                        </button>)
                            }
                            <button className='viewGame' onClick={() => handleView(item)}>
                                VIEW
                            </button>
                        </div>
                    </li>
                    )) : <span className='noGames'>No games yet...</span>}
            </ul>
        </>
    )
}

export default observer(GamesList);