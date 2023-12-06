import React, {useEffect, useRef, useState} from 'react'
import { MdOutlineChat } from "react-icons/md/index.esm";
import usFlag from '../imgs/us_flag.png'
import { VscSend } from "react-icons/vsc/index.esm";
import {players} from "../mainPage/playzone/gamesInfo";
import MessageList from "./messageList";
import {BiArrowToRight} from "react-icons/bi";

function Chat() {
    const [chatOpened, setChatOpened] = useState(false);
    const [mes, setMes] = useState('')
    const [messages, setMessages] = useState([])
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [connected, setConnected] = useState(false)

    const user = players[0]

    const socket = useRef()

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true);
            console.log('Socket connected')
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [...prev, message])
        }
        socket.current.onclose = () => {
            console.log('Socket closed') //!!!!!!!!!
        }
        socket.current.onerror = () => {
            console.log('Error socket') //!!!!!!!!!!!
        }
    }, [])

    useEffect(() => {
        if(mes.trim().length) {
            setBtnDisabled(false)
        }
        else {
            setBtnDisabled(true)
        }
    }, [mes]);

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
            const message = {
                message: mes,
                id: Date.now(),
                time: new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }).format(new Date()),
                user: user,
                event: 'message'
            }
                socket.current.send(JSON.stringify(message))
            if(messages.length > 49) {
                messages.splice(0, 1);
            }
            setMes('')
        }
    }

    return (
        <div>
            {!chatOpened &&
                <div className='chatIcon' onClick={handleChat}>
                    <MdOutlineChat style={{marginTop: 7}}/>
                </div>
            }
            {chatOpened ? <div className='chatSpace'>
                <div className='chatUpperPanel'>
                    <div className='chatText'>
                        <MdOutlineChat className='chatIconUpper'/>
                        <a className='chatTitle'>Chat</a>
                    </div>
                    <div className='langChoice'>
                        <a>EN</a>
                        <img src={usFlag} alt='' className='langFlag'/>
                    </div>
                    <BiArrowToRight style={{fontSize: '1.3em', cursor: "pointer"}} onClick={handleChat}/>
                </div>
                <MessageList messages={messages} />
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
            </div> : <div />}
        </div>
    )
}

export default Chat;