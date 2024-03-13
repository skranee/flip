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
    }, [store, store.user.role]);

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
            await store.sendQuestion(inputMessage, store.user.id);
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
                            <span className='supportHeader'>NEED HELP WITH MM2FLIP.COM?</span>
                            <textarea
                                className='supportSpace'
                                onChange={handleChange}
                                placeholder="Type here..."
                                onKeyDown={handleKeyDown}
                                value={inputMessage}
                            />
                            <div className='btnsSupport'>
                                <button className='supportBtn' onClick={() => globalStore.setAskedQuestions(true)}>
                                    POPULAR QUESTIONS
                                </button>
                                <button className='supportBtn' onClick={openAnswers}>
                                    YOUR QUESTIONS
                                </button>
                                <button className='supportBtn' disabled={disabled} onClick={handleSend}>
                                    SEND
                                </button>
                            </div>
                            {globalStore.askedQuestions &&
                                <div className='backgroundModal' onClick={() => globalStore.setAskedQuestions(false)}>
                                    <div
                                        className='modalWindowMain'
                                        style={{
                                            maxHeight: '90vh',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            fontFamily: 'Poppins, sans-serif',
                                            textShadow: '0 0 4px rgba(255, 255, 255, 0.4)',
                                            justifyContent: "flex-start",
                                            overflowY: "auto"
                                        }}
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <h2>Can I get banned on the website ?</h2>
                                        <p>
                                            The answer is yes, you can get banned on the website and without any
                                            warnings. Reasons for getting banned are: violence / harassing /
                                            racism / politics in the chat, abusing website vulnerabilities and not telling about them,
                                            purposely trying to degrade work of the website, abusing the support system and spamming
                                            there. Admins have rights to ban you permanently for not following simple rules of
                                            service using.
                                        </p>
                                        <h2>How do I withdraw my items ?</h2>
                                        <p>
                                            Open the inventory by clicking on your balance on the navigation bar. There you'll
                                            find the needed button. Pay attention to the fact, that you may be unable to withdraw
                                            all of items you want in one step. The system works as follows - finds out which of 3 bots
                                            has more of items that you want to withdraw, then offers you to connect to that bot and
                                            get your items from it. If there are any items you are unable to withdraw at the moment,
                                            they are immediately returned to your inventory and you become able to use them on the website
                                            or withdraw them again from another bot. In the connect window you may see, which bot
                                            has your items for withdraw, you are not allowed to withdraw your items from another bot.
                                        </p>
                                        <h2>Do you take any fees ?</h2>
                                        <p>
                                            Yes, we do take some fees on the website. These fees are all 10% cuts. Every time a game
                                            is played, all of the items in the game combined are going to the winner's inventory
                                            except 10% of them (decided according to their value). Also if a winner has gems as the prize,
                                            he receives 90% of them. One more place where we are taking a fee is market. The market on our
                                            website allows users to sell and buy their items for fixed prices. Every time a user
                                            buys any item, whoever sold it receives 90% of the item's cost.
                                        </p>
                                        <h2>How can I get help with the website ?</h2>
                                        <p>
                                            We have admins on the website. You can use support page for any questions you get while
                                            using the website. Do not forget, that admins are real people, so respect their time
                                            and do not spam in support messages. If you are caught on spamming in support system /
                                            abusing it / trolling, you get banned immediately.
                                        </p>
                                        <h2>Will you have any updates ?</h2>
                                        <p>
                                            Yes, we are planning to update the website and develop it. There is no exact information
                                            about what updates you will see in the future, but the website is in the beta now and
                                            we are looking forward to improve the user experience by releasing new updates for the
                                            service.
                                        </p>
                                    </div>
                                </div>
                            }
                            {globalStore.openAnswers &&
                                <div className='backgroundModal' onClick={handleBlur}>
                                    <div
                                        className='modalWindow'
                                        style={{
                                            maxHeight: '90vh',
                                        }}
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <span className='yourAnswersHeader'>ANSWERS</span>
                                        <AnswersList answers={answers} />
                                    </div>
                                </div>
                            }
                        </>
                    }
                    {store.user.role === 'admin' &&
                        <>
                            <span className='supportHeader'>QUESTIONS</span>
                            <QuestionsList questions={questions}/>
                        </>
                    }
                    {(!store.user || !store.user.id) &&
                        <span className='notAuthorizedText'>Not authorized</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default observer(Support);