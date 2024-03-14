import React, {useContext, useRef, useState} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function BuyModal({item}) {
    const {store, globalStore} = useContext(Context);
    const modalRef = useRef();
    const [clickInside, setClickInside] = useState(false);

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

    const handleMouseDown = (event) => {
        if (modalRef.current && modalRef.current.contains(event.target)) {
            setClickInside(true)
        }
        else {
            setClickInside(false);
        }
    };

    const handleMouseUp = () => {
        if(clickInside) {
            globalStore.setBuyOpen(true);
        }
        else {
            globalStore.setBuyOpen(false)
            setClickInside(false)
        }
    };

    return (
        <div className='backgroundModal' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div className='modalBuy' ref={modalRef}>
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