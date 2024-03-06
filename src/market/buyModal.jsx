import React, {useContext} from 'react';
import {Context} from "../index";
import gem from '../imgs/currImg.png'
import {currProp} from "./market";

function BuyModal({item}) {
    const {store, globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setBuyOpen(false);
    }

    const chooseColor = (rarity) => {
        if(rarity === 'legendary') {
            return '237, 142, 0'
        }
        else if(rarity === 'mythical') {
            return '185, 0, 222'
        }
    }

    const buy = async () => {
        if(store.user.balance >= item.price / 2.5) {
            const buy = await store.buyItemMarket(item.owner, store.user.id, item.itemId);
        } else {
            return Error('Not enough balance');
        }
        globalStore.setBuyOpen(false);
        window.location.reload();
    }

    const add = async () => {
        await store.addItemBot(store.user.robloxId, {
            name: items[0].name,
            rarity: items[0].rarity,
            image: items[0].image,
            price: items[0].price
        });
        // const success = await store.checkOwnership(store.user.robloxId, item);
        // console.log(success.data)
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
                    <a>{Math.round(item.price / currProp)}</a>
                </div>
                <button className='btnBuy' style={{width: '70%', height: 30, fontSize: '1.3em'}} onClick={buy}>
                    Buy
                </button>
            </div>
        </div>
    )
}

export default BuyModal;