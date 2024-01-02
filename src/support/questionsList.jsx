import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {Context} from "../index";

function QuestionsList({questions}) {
    const {globalStore} = useContext(Context)
    const navigate = useNavigate()

    const handleQuestion = (question) => {
        localStorage.setItem('question', JSON.stringify(question));
        navigate('/answer')
    }

    return (
        <ul className='questionsSpace'>
            {questions.map((item, index) => (
                item.answered === false &&
                <li className='questionContainer' key={index} onClick={() => handleQuestion(item)}>
                    <a className='messageQuestion'>{item.message}</a>
                    <div className='usernameQuestion'>{item.userId.username}</div>
                </li>
            ))}
        </ul>
    )
}

export default QuestionsList;