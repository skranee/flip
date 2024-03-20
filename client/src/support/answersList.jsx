import React from 'react';

function AnswersList({answers}) {
    return (
        <ul className='answersSpace'>
            {answers.map((item, index) => (
                <li className='answerContainer'>
                    <div className='answer'>
                        <span className='answerHeader'>Question:</span>
                        <span className='answerText'>{item.message}</span>
                    </div>
                    <div className='answer' style={{borderBottom: "none"}}>
                        <span className='answerHeader'>Answer:</span>
                        <span className='answerText'>{item.answer}</span>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default AnswersList;