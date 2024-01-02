import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {useNavigate} from "react-router-dom";

function Answer() {
    const {store, globalStore} = useContext(Context);
    const [ans, setAns] = useState('');
    const [disabled, setDisabled] = useState(true);
    const question = JSON.parse(localStorage.getItem('question'));
    const navigate = useNavigate()

    const handleChange = (event) => {
        if(event.target.value.trim().length) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        setAns(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (ans !== '') {
                handleSend();
            }
        }
    };

    const handleSend = async () => {
        if(ans.trim().length) {
            const answer = await store.answer(question._id, ans);
            localStorage.removeItem('question');
            setAns('');
            navigate('/support')
        }
    }

    return (
        <div>
            <div className='background' />
            <div className='supportPage'>
                <div className='supportContainer' style={{gap: 15}}>
                    {store.user.role === 'admin' && question &&
                        <>
                            <a className='supportHeader'>{question.userId.username.toUpperCase()}'S QUESTION</a>
                            <a className='answerMes'>{question.message}</a>
                            <textarea
                                className='supportSpace'
                                onChange={handleChange}
                                placeholder="Type here..."
                                onKeyDown={handleKeyDown}
                                value={ans}
                            />
                            <button className='btnAnswer' onClick={handleSend} disabled={disabled}>
                                ANSWER
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Answer;