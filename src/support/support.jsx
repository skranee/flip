import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import QuestionsList from "./questionsList";
import AnswersList from "./answersList";

function Support() {
    const {store, globalStore} = useContext(Context);
    const [inputMessage, setInputMessage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])

    useEffect(() => {
        if(store.user.role === 'admin') {
            const getQ = async () => {
                const questionsArr = await store.getQuestions();
                if(questionsArr && questionsArr.data) {
                    setQuestions(questionsArr.data);
                }
            }
            getQ();
        }
    }, [store.user.role]);

    const containerWidth = () => {
        if(!globalStore.chatOpened && globalStore.panelOpen) {
            return '84.5%'
        }
        else if(!globalStore.chatOpened && !globalStore.panelOpen) {
            return '97.5%'
        }
        else if(globalStore.chatOpened && !globalStore.panelOpen) {
            return '81%'
        }
        else {
            return '68%'
        }
    }

    const handleChange = (event) => {
        if(event.target.value.trim().length) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        setInputMessage(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (inputMessage !== '') {
                handleSend();
            }
        }
    };

    const handleSend = async () => {
        if(inputMessage.trim().length) {
            const send = await store.sendQuestion(inputMessage, store.user.id);
            setInputMessage('');
            setDisabled(true);
        }
    }

    const openAnswers = async () => {
        const response = await store.getAnswers(store.user.id);
        if(response && response.data) {
            setAnswers(response.data);
        }
        globalStore.setOpenAnswers(true);
    }

    const handleBlur = () => {
        globalStore.setOpenAnswers(false);
    }

    return (
        <div>
            <div className='background' />
            <div className='supportPage'>
                <div className='supportContainer' style={{
                    width: containerWidth(),
                    marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                }}>
                    {(store.user.role === 'user' || store.user.role === 'developer') &&
                        <>
                            <a className='supportHeader'>NEED HELP WITH MM2FLIP.COM?</a>
                            <textarea
                                className='supportSpace'
                                onChange={handleChange}
                                placeholder="Type here..."
                                onKeyDown={handleKeyDown}
                                value={inputMessage}
                            />
                            <div className='btnsSupport'>
                                <button className='supportBtn'>
                                    POPULAR QUESTIONS
                                </button>
                                <button className='supportBtn' onClick={openAnswers}>
                                    YOUR QUESTIONS
                                </button>
                                <button className='supportBtn' disabled={disabled} onClick={handleSend}>
                                    SEND
                                </button>
                            </div>
                            {globalStore.openAnswers &&
                                <div className='backgroundModal' onClick={handleBlur}>
                                    <div
                                        className='modalWindow'
                                        style={{
                                            maxHeight: '90vh',
                                        }}
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <a className='yourAnswersHeader'>ANSWERS</a>
                                        <AnswersList answers={answers} />
                                    </div>
                                </div>
                            }
                        </>
                    }
                    {store.user.role === 'admin' &&
                        <>
                            <a className='supportHeader'>QUESTIONS</a>
                            <QuestionsList questions={questions}/>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default observer(Support);