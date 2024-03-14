import React, {useContext} from "react";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";

function Dropdown () {
    const {globalStore} = useContext(Context)
    const navigate = useNavigate();

    const handleSoon = () => {
        globalStore.setErrorMessage('Coming soon...');
        globalStore.setErrorWindow(true);
    }

    return (
        <div className='listContainer' onClick={(event) => event.stopPropagation()}>
            <span className='gamesTitle' onClick={handleSoon}>Upgrade</span>
            <span className='gamesTitle' onClick={() => navigate('/')}>CoinFlip</span>
            <span className='gamesTitle' onClick={handleSoon}>Battle</span>
            <span className='gamesTitle' onClick={handleSoon}>Plinko</span>
        </div>
    )
}

export default Dropdown