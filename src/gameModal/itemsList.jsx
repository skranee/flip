import React from "react";
import {currProp} from "../market/market";
import gem from '../imgs/currImg.png'

function ItemsList({items}) {


    return (
        <ul className='lobbyItemsListContainer'>
            {items.map((item, index) => (
                <li className='lobbyItemContainer' key={index}>
                    <img src={item.image} className='lobbyItemImage' alt=''/>
                    <a className='lobbyItemName'>{item.name}</a>
                    <a className='lobbyItemCost'>{Math.round(item.price / currProp)} <img src={gem} className='gemWorth' alt='' /> </a>
                </li>
            ))}
        </ul>
    )
}

export default ItemsList;