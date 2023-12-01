import React, {useRef, useEffect} from 'react';

function MessageList({messages}) {
    const bottomRef = useRef();

    useEffect(() => {
        if (bottomRef.current && bottomRef.current.scrollIntoView) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <ul className='messageSpace'>
            {messages.map((item, index) => (
                <li className='chatMessage' key={index} style={{top: `${index * 8}%`}}>
                    <img className='imageMessage' src={item.user.avatar} alt=''/>
                    <div className='user_time'>
                        <a>{item.user.name}</a>
                        <a style={{left: '50%'}}> {item.time} </a>
                    </div>
                    <a className='message'>{item.message}</a>
                    <div ref={bottomRef}></div>
                </li>
            ))}
        </ul>
    )
}

export default MessageList;