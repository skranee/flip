import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function CancelModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setCancelSale(false);
    }

    const chooseColor = (rarity) => {
        if(rarity === 'legendary') {
            return '237, 142, 0'
        }
        else if(rarity === 'mythical') {
            return '185, 0, 222'
        }
    }

    const cancel = async () => {
        const cancel = await store.removeItemMarket(item.itemId);
        globalStore.setCancelSale(false);
        window.location.reload();
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalBuy' onClick={(event) => event.stopPropagation()}>
                <a className='headerBuy'>{item.name}</a>
                <img src={item.image} className='imageBuy' alt='' />
                <a
                    className='rarityBuy'
                    style={{color: `rgba(${chooseColor(item.rarity)}, 1)`,
                        textShadow: `0 2px 10px rgba(${chooseColor(item.rarity)}, 0.6)`}}
                >
                    {item.rarity}
                </a>
                <div className='priceBuy'>
                    <img className='gemBuy' src={gem} alt='' />
                    <a>{Math.round(item.price)}</a>
                </div>
                <button className='btnBuy' style={{width: '70%', height: 30, fontSize: '1.3em'}} onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default CancelModal;