import React, { useRef, useEffect, useContext, useState } from 'react';
import { Context } from "../index";

function MessageList({ messages }) {
    const { globalStore, store } = useContext(Context);
    const bottomRef = useRef();

    useEffect(() => {
        if (bottomRef.current && bottomRef.current.scrollIntoView) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const color = (user) => {
        if (user.lvl >= 50) {
            return '#00a1db';
        } else if (user.lvl >= 10) {
            return '#b00000';
        } else {
            return '#FFFFFF';
        }
    }

    const viewProfile = (user, avatar) => {
        globalStore.setProfileUser(user);
        globalStore.setProfileAv(avatar);
        globalStore.setProfileOpen(true);
    }

    return (
        <>
            <ul className='messageSpace'>
                {messages.map((item, index) => (
                    <li className='chatMessage' key={index}>
                        <div className='imgChatContainer' onClick={() => viewProfile(item.user, item.avatar)}>
                            <img className='imageMessage' src={item.avatar} alt='' />
                            <div className='chatLvl' style={{ border: `solid 1px ${color(item.user)}` }}>
                                {item.user.lvl}
                            </div>
                        </div>
                        <div className='messageBox'>
                            <div className='user_time'>
                                <a>{item.user.username}</a>
                                <a> {item.time} </a>
                            </div>
                            <a className='message'>{item.message}</a>
                        </div>
                        <div ref={bottomRef}></div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default MessageList;
