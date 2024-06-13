import React, {useContext, useEffect, useRef, useState} from 'react'
import { MdOutlineChat } from "react-icons/md/index.esm";
import { VscSend } from "react-icons/vsc/index.esm";
import MessageList from "./messageList";
import {BiArrowToRight} from "react-icons/bi";
import {Context} from "../index";
import {observer} from "mobx-react";
import online from '../imgs/online.png'
import gem from '../imgs/currImg.png'
import axios from "axios";
import {API_URL} from "../http";
import {FaCrown} from "react-icons/fa";
import {RiMacbookFill} from "react-icons/ri";
import {notify} from "../App";
import {banWords} from "./banwords";

export function participateFunction() {}

export function joinGameFunction(message) {}

export function giveawayCreate() {}

function Chat() {
    const [messages, setMessages] = useState([]);
    const {store, globalStore} = useContext(Context);
    const [mes, setMes] = useState('')
    const modalRef = useRef();
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [clickInside, setClickInside] = useState(false)
    const [usersOnline, setUsersOnline] = useState(0);
    const stream = globalStore.streamLive;

    const user = store.user;
    const socket = useRef();

    useEffect(() => {
        let pingInterval;
        socket.current = new WebSocket("ws://209.38.218.8:4000");
        function heartbeat() {
            socket.current.send(JSON.stringify({ type: 'pong' }));
        }

        participateFunction = () => {
            socket.current.send(JSON.stringify({
                method: 'participate',
                user: store.user
            }))
        }

        joinGameFunction = (message) => {
            socket.current.send(JSON.stringify(message));
        }

        giveawayCreate = (message) => {
            socket.current.send(JSON.stringify(message));
        }

        socket.current.onopen = () => {
            socket.current.addEventListener('ping', heartbeat);

            socket.current.send(JSON.stringify({
                username: user.username,
                method: 'connection'
            }))
        }
        socket.current.onmessage = (event) => {
            let message = JSON.parse(event.data)
            switch (message.method) {
                case 'message':
                    setMessages((prevState) => [...prevState, message]);
                    break;
                case 'stream':
                    if(message.streamStatus === 'live') {
                        globalStore.setStreamLive(true)
                    } else {
                        globalStore.setStreamLive(false)
                    }
                    break;
                case 'connection':
                    const msgs = message.messages;
                    setMessages(msgs);
                    setUsersOnline(message.amount);
                    break;
                case 'close':
                    setUsersOnline(message.amount);
                    break;
                case 'joinGame':
                    if(message && message.mainReceiver) {
                        if(store.user.id === message.mainReceiver) {
                            if(globalStore.viewOpen) {
                                globalStore.setViewOpen(false);
                            }
                            globalStore.setGameInfo(message.game);
                            setTimeout(async () => {
                                const updateUser = async () => {
                                    try {
                                        const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true});
                                        store.setUser(response.data.user);
                                        store.setAuth(true);
                                        localStorage.setItem('token', response.data.accessToken);
                                        localStorage.setItem('username', response.data.user.username);
                                    } catch(e) {
                                        localStorage.removeItem('avatarUrl');
                                    }
                                }
                                await updateUser();
                            }, 4500)
                            setTimeout(() => {
                                globalStore.setCountdown(true);
                                globalStore.setViewOpen(true);
                            }, 500)
                        }
                    }
                    break;
                case 'giveaway':
                    globalStore.setGiveawayGoing(message.giveawayStatus);
                    try {
                        if(message.firstAnnounce) {
                            notify();
                        }
                    } catch(e) {
                        console.log(e);
                    }
                    globalStore.setGiveawayData(message.giveaway);
                    globalStore.setGiveawayTimer(message.giveaway.timer);
                    globalStore.setGiveawayParticipants(message.participants);
                    break;
                case 'timeUpdate':
                    globalStore.setGiveawayTimer(message.time);
                    break;
                case 'giveawayEnded':
                    if(message.winner) {
                        globalStore.setGiveawayWinner(message.winner);
                    }
                    globalStore.setGiveawayTimer('');
                    socket.current.send(JSON.stringify({
                        method: 'endGiveaway'
                    }))
                    setTimeout(() => {
                        globalStore.setGiveawayWinner('');
                        globalStore.setGiveawayData({});
                        globalStore.setGiveawayParticipants(0);
                        globalStore.setGiveawayGoing(false);
                    }, 30 * 1000)
                    break;
                case 'participate':
                    globalStore.setGiveawayParticipants(message.participants);
                    break;
                default:
                    break;
            }
        }
        socket.current.onclose = () => {
            clearInterval(pingInterval);
        }
        socket.current.onerror = (error) => {
            console.log('WS error');
        }
        return () => {
            socket.current.close();
        }
    }, [user.username, store, globalStore, ]);

    useEffect(() => {
        if(mes.trim().length) {
            setBtnDisabled(false)
        }
        else {
            setBtnDisabled(true)
        }
    }, [mes]);

    const openStream = (path) => {
        window.open(path)
    }

    const handleChat = () => {
        globalStore.setChatOpened(!globalStore.chatOpened)
    }

    const handleChange = (text) => {
        setMes(text)
    }

    const handleKeyDown = async (event) => {
        if(event.key === 'Enter') {
            await handleSend()
        }
    }

    const handleSend = async () => {
        if(!store.user.id) {
            globalStore.setErrorMessage('Authorize first!')
            globalStore.setErrorWindow(true);
        } else {
            if(mes.length && mes.trim().length) {
                for(const word of banWords) {
                    if(mes.replace(/\s/g, '').toLowerCase().includes(word.replace(/\s/g, '').toLowerCase())) {
                        setMes('');
                        globalStore.setErrorMessage('Cussing is not allowed');
                        globalStore.setErrorWindow(true);
                        return null;
                    }
                }
                if(mes[0] === '/') {
                    if(mes.substring(1, 4) === 'tip') {
                        const params = mes.split(' ');
                        if(params[1] && params[2]) {
                            const receiver = params[1];
                            if(receiver === store.user.username) {
                                globalStore.setErrorMessage('You can not tip yourself');
                                globalStore.setErrorWindow(true);
                                return null;
                            }
                            const amount = parseInt(params[2]);
                            if(amount < 400) {
                                globalStore.setErrorMessage('You can not send less than 400 gems');
                                globalStore.setErrorWindow(true);
                                return null;
                            }
                            const tip = await store.tip(receiver, amount);
                            if(tip && tip.data && tip.data.status && tip.data.status === 400) {
                                globalStore.setErrorMessage('Check your balance or receiver username');
                                globalStore.setErrorWindow(true);
                                return null;
                            }
                        }
                        setMes('');
                        return null;
                    }
                    return null;
                }
                const message = {
                    message: mes,
                    id: Date.now(),
                    time: new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    }).format(new Date()),
                    method: 'message'
                }
                setMes('');
                await store.sendMessage(message);
                if(messages.length > 49) {
                    messages.splice(0, 1);
                }
                setMes('')
            }
        }
    }

    const handleStream = async () => {
        if(user.role === 'admin') {
            let notification = {};
            if(globalStore.streamLive) {
                notification = {
                    id: Date.now(),
                    method: 'stream',
                    streamStatus: 'offline'
                }
            } else {
                notification = {
                    id: Date.now(),
                    method: 'stream',
                    streamStatus: 'live'
                }
            }
            socket.current.send(JSON.stringify(notification));
        }
    }

    const handleMouseDown = (event) => {
        if (modalRef.current && modalRef.current.contains(event.target)) {
            setClickInside(true)
        }
        else {
            setClickInside(false);
        }
    };

    const handleMouseUp = () => {
        if(clickInside) {
            globalStore.setProfileOpen(true);
        }
        else {
            globalStore.setProfileOpen(false)
            setClickInside(false)
        }
    };

    const color = (user) => {
        if (user.lvl >= 50) {
            return '#00a1db';
        } else if (user.lvl >= 10) {
            return 'rgb(255, 0, 0)';
        } else {
            return '#FFFFFF';
        }
    }

    const convertToK = (number) => {
        if(number < 1000) {
            return `${number}`
        }
        else if(number >= 1000 && number < 1000000) {
            const fixed = (number / 1000).toFixed(1);
            return `${fixed} K`
        }
        else if(number > 1000000) {
            const fixed = (number / 1000000).toFixed(2);
            return `${fixed} KK`
        }
    }

    return (
        <div>
            {!globalStore.chatOpened &&
                <div className='chatIcon' onClick={handleChat}>
                    <MdOutlineChat />
                </div>
            }
            <div className='chatSpace' style={{width: globalStore.chatOpened ? '' : 0}}>
                {globalStore.chatOpened &&
                    <div className='chatInner'>
                        <div className='chatUpperPanel'>
                            <div className='usersOnline'>
                                <img src={online} className='onlineCircle' alt=''/>
                                <span> {usersOnline}</span>
                            </div>
                            <div className='chatText'>
                                <span className='chatTitle'>CHAT</span>
                            </div>
                            <BiArrowToRight style={{fontSize: '1.3em', cursor: "pointer"}} onClick={handleChat}/>
                        </div>
                        <MessageList messages={messages} />
                        {store.user.role === 'admin' &&
                            <button onClick={handleStream} className='btnStream'>
                                {stream ? 'Turn off' : 'Stream'}
                            </button>
                        }
                        {stream
                            ? <div className='streamNotification'>
                                Stream Live!
                                <button className='streamBtn' onClick={() => openStream('https://www.twitch.tv/mm2flip')}>
                                    Twitch
                                </button>
                                <button className='streamBtn' onClick={() => openStream('https://kick.com/mm2flip')}>
                                    Kick
                                </button>
                            </div>
                            : <div />
                        }
                        <div className='sendContainer'>
                            <input
                                className='inputSend'
                                type='text'
                                value={mes}
                                placeholder='Type here...'
                                onChange={(event) => handleChange(event.target.value)}
                                onKeyDown={(event) => handleKeyDown(event)}
                            />
                            <button disabled={btnDisabled} className='btnSend' onClick={() => handleSend()}>
                                <VscSend />
                            </button>
                        </div>
                    </div>
                }
            </div>
            {globalStore.profileOpen &&
                <div className='backgroundModal' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                    <div className='modalPlayer' style={{maxWidth: 250}} ref={modalRef}>
                        <div className='userInfoModal'>
                            <div className='profileImageContainer'>
                                <img
                                    className='avatarProfile'
                                     style={{
                                         boxShadow: `0 0 5px ${color(globalStore.profileUser)}`,
                                         border: `solid 1px ${color(globalStore.profileUser)}`
                                }}
                                    src={globalStore.profileAv} alt=''
                                />
                                <div
                                    className='profileLvl'
                                    style={{
                                        textShadow: 'none',
                                        border: `solid 1px ${color(globalStore.profileUser)}`
                                }}
                                >
                                    {globalStore.profileUser.lvl}
                                </div>
                            </div>
                            <span className='profileUsername' style={{color: color(globalStore.profileUser), textShadow: `0 0 3px ${color(globalStore.profileUser)}`}}>
                                {globalStore.profileUser.role === 'admin' && <FaCrown className='iconRoleChat' style={{color: color(globalStore.profileUser)}} />}
                                {globalStore.profileUser.role === 'developer' && <RiMacbookFill className='iconRoleChat' style={{color: color(globalStore.profileUser)}}/>}
                                {globalStore.profileUser.username}
                            </span>
                        </div>
                        <div className='profileInfoPlayer'>
                            <span style={{color: 'rgba(232, 232, 232, 0.8)', textShadow: '1px 1px 4px rgba(232, 232, 232, 0.5)'}}>Total games played:</span>
                            <span style={{fontSize: '1.7em', textShadow: '1px 1px 5px rgba(255, 255, 255, 0.7)'}}>{Math.round(globalStore.profileUser.gamesPlayed)}</span>
                            <span style={{color: 'rgba(232, 232, 232, 0.8)', textShadow: '1px 1px 4px rgba(232, 232, 232, 0.5)'}}>Total wagered:</span>
                            <span style={{fontSize: '1.7em', textShadow: '1px 1px 5px rgba(255, 255, 255, 0.7)'}}>
                                {convertToK(Math.round(globalStore.profileUser.totalWagered))} <img src={gem} className='gemBuy' alt='' />
                            </span>
                            <span style={{color: 'rgba(232, 232, 232, 0.8)',  textShadow: '1px 1px 4px rgba(232, 232, 232, 0.5)'}}>Registered:</span>
                            <span style={{fontSize: '1.4em', textShadow: '1px 1px 5px rgba(255, 255, 255, 0.7)'}}>{globalStore.profileUser.regDate}</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default observer(Chat);