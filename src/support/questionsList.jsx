import React from 'react';
import {useNavigate} from "react-router-dom";

function QuestionsList({questions}) {
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
                    <span className='messageQuestion'>{item.message}</span>
                    <div className='usernameQuestion'>{item.userId.username}</div>
                </li>
            ))}
        </ul>
    )
}

export default QuestionsList;