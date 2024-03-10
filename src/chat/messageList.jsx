import React, { useRef, useEffect, useContext } from 'react';
import { Context } from "../index";
import { FaCrown } from "react-icons/fa";
import { RiMacbookFill } from "react-icons/ri";
import {observer} from "mobx-react";

function MessageList({ messages }) {
    const { globalStore } = useContext(Context);
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
            return 'rgb(255, 0, 0)';
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
                                {item.user.role === 'admin' && <FaCrown className='iconRoleChat' style={{color: color(item.user)}} />}
                                {item.user.role === 'developer' && <RiMacbookFill className='iconRoleChat' style={{color: color(item.user)}}/>}
                                <span style={{color: color(item.user)}}>{item.user.username}</span>
                                <span> {item.time} </span>
                            </div>
                            <span className='message'>{item.message}</span>
                        </div>
                        <div ref={bottomRef}></div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default observer(MessageList);
