import React from "react";

function ItemsList({items}) {
    return (
        <ul className='lobbyItemsListContainer'>
            {items.map((item, index) => (
                <li className='lobbyItemContainer'>
                    <img src={item.image} className='lobbyItemImage' alt=''/>
                    <a className='lobbyItemName'>{item.name}</a>
                    <a className='lobbyItemCost'>{item.cost}R$</a>
                </li>
            ))}
        </ul>
    )
}

export default ItemsList;