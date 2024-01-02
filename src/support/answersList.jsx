import React from 'react';

function AnswersList({answers}) {
    return (
        <ul className='answersSpace'>
            {answers.map((item, index) => (
                <li className='answerContainer'>
                    <div className='answer'>
                        <a className='answerHeader'>Question:</a>
                        <a className='answerText'>{item.message}</a>
                    </div>
                    <div className='answer' style={{borderBottom: "none"}}>
                        <a className='answerHeader'>Answer:</a>
                        <a className='answerText'>{item.answer}</a>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default AnswersList;