import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'

function BuyModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setBuyOpen(false);
    }

    const chooseColor = (rarity) => {
        if(rarity === 'Legendary') {
            return '145, 0, 181'
        }
        else if(rarity === 'Common') {
            return '176, 166, 179'
        }
        else if(rarity === 'Uncommon') {
            return '203, 207, 178'
        }
        else if(rarity === 'Rare') {
            return '192, 204, 120'
        }
        else if(rarity === 'Godly') {
            return '227, 255, 56'
        }
        else if(rarity === 'Unique') {
            return '3, 0, 168'
        }
        else if(rarity === 'Ancient') {
            return '255, 200, 0'
        }
        else if(rarity === 'Pets') {
            return '242, 22, 55'
        }
        else if(rarity === 'Vintage') {
            return '97, 71, 0'
        }
    }

    const buy = async () => {
        if(store.user.balance >= item.price) {
            await store.buyItemMarket(item.owner, store.user.id, item.itemId);
        } else {
            return Error('Not enough balance');
        }
        globalStore.setBuyOpen(false);
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
                <button className='btnBuy' disabled={!store.user || !store.user.id} style={{width: '70%', height: 30, fontSize: '1.3em'}} onClick={buy}>
                    Buy
                </button>
            </div>
        </div>
    )
}

export default BuyModal;