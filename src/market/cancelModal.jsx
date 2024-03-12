import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function CancelModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setCancelSale(false);
    }

    const cancel = async () => {
        await store.removeItemMarket(item.itemId);
        globalStore.setCancelSale(false);
        window.location.reload();
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalBuy' onClick={(event) => event.stopPropagation()}>
                <span className='headerBuy'>{item.name}</span>
                <img src={item.image} className='imageBuy' alt='' />
                <div className='priceBuy'>
                    <img className='gemBuy' src={gem} alt='' />
                    <span>{Math.round(item.price)}</span>
                </div>
                <button className='btnBuy' style={{width: '70%', height: 30, fontSize: '1.3em'}} onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default CancelModal;