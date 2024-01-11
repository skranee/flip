import React, {useContext, useEffect, useRef, useState} from 'react'
import { MdOutlineChat } from "react-icons/md/index.esm";
import usFlag from '../imgs/us_flag.png'
import { VscSend } from "react-icons/vsc/index.esm";
import MessageList from "./messageList";
import {BiArrowToRight} from "react-icons/bi";
import {Context} from "../index";
import {observer} from "mobx-react";
import online from '../imgs/online.png'

function Chat() {
    const {store, globalStore} = useContext(Context)
    const [chatOpened, setChatOpened] = useState(false);
    const [mes, setMes] = useState('')
    const [messages, setMessages] = useState([])
    const modalRef = useRef();
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [connected, setConnected] = useState(false)
    const [clickInside, setClickInside] = useState(false)
    const [usersOnline, setUsersOnline] = useState(0);
    const stream = globalStore.streamLive;

    const user = store.user;
    const socket = useRef();

    useEffect(() => {
        if(user.username) {
            let pingInterval;
            socket.current = new WebSocket('ws://localhost:4000');

            function heartbeat() {
                socket.current.send(JSON.stringify({ type: 'pong' }));
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
                        setArray(message);
                        break;
                    case 'stream':
                        if(message.streamStatus === 'live') {
                            globalStore.setStreamLive(true)
                        } else {
                            globalStore.setStreamLive(false)
                        }
                        break;
                    case 'connection':
                        setUsersOnline(message.amount);
                        break;
                    case 'close':
                        setUsersOnline(message.amount);
                }
            }
            socket.current.onclose = () => {
                clearInterval(pingInterval);
            }
            socket.current.onerror = (error) => {
                console.log('WS error: ', error);
            }

            return () => {
                socket.current.close();
            }
        }
    }, [user.username, ]);

    useEffect(() => {
        console.log('rendered')
    }, []);

    const setArray = (message) => {
        console.log('here')
        setMessages(prev => [...prev, message]);
        return null;
    }

    const log = () => {
        console.log('yoyoyo')
    }

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
        setChatOpened(!chatOpened)
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
        if(mes.length && mes.trim().length) {
            if(mes[0] === '/') {
                console.log(mes.substring(1, 4))
                if(mes.substring(1, 4) === 'tip') {
                    const params = mes.split(' ');
                    if(params[1] && params[2]) {
                        const sender = store.user.username;
                        const receiver = params[1];
                        const amount = parseInt(params[2]);
                        const send = await store.tip(sender, receiver, amount);
                    }
                    setMes('');
                    return null;
                }
            }
            const message = {
                message: mes,
                id: Date.now(),
                time: new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }).format(new Date()),
                user: user,
                avatar: localStorage.getItem('avatarUrl'),
                method: 'message'
            }
            setMes('');
            socket.current.send(JSON.stringify(message))
            if(messages.length > 49) {
                messages.splice(0, 1);
            }
            setMes('')
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

    return (
        <div>
            {!chatOpened &&
                <div className='chatIcon' onClick={handleChat}>
                    <MdOutlineChat style={{marginTop: 7}}/>
                </div>
            }
            {chatOpened ? <div className='chatSpace'>
                <div className='chatInner'>
                    <div className='chatUpperPanel'>
                        <div className='chatText'>
                            <MdOutlineChat className='chatIconUpper'/>
                            <a className='chatTitle'>Chat</a>
                        </div>
                        {/*<div className='langChoice'>*/}
                        {/*    <a>EN</a>*/}
                        {/*    <img src={usFlag} alt='' className='langFlag'/>*/}
                        {/*</div>*/}
                        <div className='usersOnline'>
                            <img src={online} className='onlineCircle' alt=''/>
                            <a>Online: {usersOnline}</a>
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
            </div> : <div />}
            {globalStore.profileOpen &&
                <div className='backgroundModal' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                    <div className='modalPlayer' style={{maxWidth: 250}} ref={modalRef}>
                        <div className='userInfoModal'>
                            <div className='profileImageContainer'>
                                <img className='avatarProfile' src={globalStore.profileAv} alt='' />
                                <div className='profileLvl'>{globalStore.profileUser.lvl}</div>
                            </div>
                            <a>{globalStore.profileUser.username}</a>
                        </div>
                        <div className='profileInfoPlayer'>
                            <a style={{color: 'rgba(232, 232, 232, 0.8)'}}>Total games played:</a>
                            <a style={{fontSize: '1.7em'}}>{globalStore.profileUser.gamesPlayed}</a>
                            <a style={{color: 'rgba(232, 232, 232, 0.8)'}}>Total wagered:</a>
                            <a style={{fontSize: '1.7em'}}>{globalStore.profileUser.totalWagered}</a>
                            <a style={{color: 'rgba(232, 232, 232, 0.8)'}}>Registered:</a>
                            <a style={{fontSize: '1.4em'}}>{globalStore.profileUser.regDate}</a>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default observer(Chat);