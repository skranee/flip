import React from "react";

function Dropdown (/*props*/) {
    return (
        <div className='dropdown'>
            <ul className='listContainer'>
                <li className='gamesTitleContainer'>
                    <a className='gamesTitle'>Upgrade</a>
                </li>
                <li className='gamesTitleContainer'>
                    <a className='gamesTitle'>CoinFlip</a>
                </li>
                <li className='gamesTitleContainer'>
                    <a className='gamesTitle'>Battle</a>
                </li>
                <li className='gamesTitleContainer'>
                    <a className='gamesTitle'>Plinko</a>
                </li>
            </ul>
        </div>
    )
}

export default Dropdown