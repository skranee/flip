import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function BuyModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setBuyOpen(false);
    }

    console.log(item.owner);

    const buy = async () => {
        if(store.user.balance >= item.price) {
            await store.buyItemMarket(item.owner, store.user.id, item.itemId);
        } else {
            return Error('Not enough balance');
        }
        globalStore.setBuyOpen(false);
        window.location.reload();
    }

    const cancel = async () => {
        await store.removeItemMarket(item.itemId);
        globalStore.setBuyOpen(false);
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
                <button
                    className='btnBuy'
                    disabled={!store.user || !store.user.id}
                    style={{width: '70%', height: 30, fontSize: '1.3em'}}
                    onClick={() => item.owner === store.user.id ? cancel() : buy()}>
                    {item.owner === store.user.id ? 'Cancel' : 'Buy'}
                </button>
            </div>
        </div>
    )
}

export default BuyModal;