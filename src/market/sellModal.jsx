import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function SellModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setSellItemOpen(false);
    }

    const chooseColor = (rarity) => {
        if(rarity === 'Legendary') {
            return '237, 142, 0'
        }
        else if(rarity === 'Common') {
            return '185, 0, 222'
        }
        else if(rarity === 'Uncommon') {
            return '185, 0, 222'
        }
        else if(rarity === 'Rare') {
            return '185, 0, 222'
        }
        else if(rarity === 'Godly') {
            return '185, 0, 222'
        }
        else if(rarity === 'Unique') {
            return '185, 0, 222'
        }
        else if(rarity === 'Ancient') {
            return '255, 200, 0'
        }
        else if(rarity === 'Pets') {
            return '185, 0, 222'
        }
        else if(rarity === 'Vintage') {
            return '185, 0, 222'
        }
    }

    const sell = async () => {
        await store.addItemMarket(store.user.id, item);
        globalStore.setSellItemOpen(false);
        window.location.reload();
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='modalBuy' onClick={(event) => event.stopPropagation()}>
                <span className='headerBuy'>{item.name}</span>
                <img src={item.image} className='imageBuy' alt='' />
                <span
                    className='rarityBuy'
                    style={{color: `rgba(${chooseColor(item.rarity)}, 1)`,
                        textShadow: `0 2px 10px rgba(${chooseColor(item.rarity)}, 0.6)`}}
                >
                    {item.rarity}
                </span>
                <div className='priceBuy'>
                    <img className='gemBuy' src={gem} alt='' />
                    <span>{Math.round(item.price)}</span>
                </div>
                <button className='btnBuy' style={{width: '70%', height: 30, fontSize: '1.3em'}} onClick={sell}>
                    Sell
                </button>
            </div>
        </div>
    )
}

export default SellModal;