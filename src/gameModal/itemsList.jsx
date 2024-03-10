import React from "react";
import gem from '../imgs/currImg.png'

function ItemsList({items}) {


    return (
        <ul className='lobbyItemsListContainer'>
            {items.map((item, index) => (
                <li className='lobbyItemContainer' key={index}>
                    <img src={item.image} className='lobbyItemImage' alt=''/>
                    <span className='lobbyItemName'>{item.name}</span>
                    <span className='lobbyItemCost'>{Math.round(item.price)} <img src={gem} className='gemWorth' alt='' /> </span>
                </li>
            ))}
        </ul>
    )
}

export default ItemsList;