import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'
import {currProp} from "./market";

function SellModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setSellItemOpen(false);
    }

    const chooseColor = (rarity) => {
        if(rarity === 'legendary') {
            return '237, 142, 0'
        }
        else if(rarity === 'mythical') {
            return '185, 0, 222'
        }
    }

    const sell = async () => {
        const sell = await store.addItemMarket(store.user.id, item);
        globalStore.setSellItemOpen(false);
        window.location.reload();
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalBuy' onClick={(event) => event.stopPropagation()}>
                <a className='headerBuy'>{item.name}</a>
                <img src={item.image} className='imageBuy' alt='' />
                <a className='classBuy'>{item.classification}</a>
                <a
                    className='rarityBuy'
                    style={{color: `rgba(${chooseColor(item.rarity)}, 1)`,
                        textShadow: `0 2px 10px rgba(${chooseColor(item.rarity)}, 0.6)`}}
                >
                    {item.rarity}
                </a>
                <div className='priceBuy'>
                    <img className='gemBuy' src={gem} alt='' />
                    <a>{Math.round(item.price / currProp)}</a>
                </div>
                <button className='btnBuy' style={{width: '70%', height: 30, fontSize: '1.3em'}} onClick={sell}>
                    Sell
                </button>
            </div>
        </div>
    )
}

export default SellModal;