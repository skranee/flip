import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import coin from '../imgs/currImg.png'
import { SlMagnifier } from "react-icons/sl";
import {items} from "../mainPage/playzone/gamesInfo";

export const currProp = 2.5;

function Market() {
    const {store} = useContext(Context)
    const [itemsValue, setItemsValue] = useState(0)
    const [value, setValue] = useState('')
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        if (store.user && store.user.itemsList) {
            const value = store.user.itemsList.reduce((a, b) => a + b.cost, 0);
            setItemsValue(Math.round(value / currProp));
        }
    }, []);

    const handleChange = (event) => {
        const searchValue = event.target.value;
        setValue(searchValue);
        
        const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredItems(filtered);
    };

    return (
        <div>
            <div className='background' />
            <div className='marketPage'>
                <div className='marketContainer'>
                    <div className='marketUpperPanel'>
                        <div className='marketItemsValue'>
                            <a>Items Value:</a>
                            <img className='marketCoinImg' src={coin} alt=''/>
                            <a>{itemsValue}</a>
                        </div>
                        <div className='rightUpperMarket'>
                            <div className='searchContainerMarket'>
                                <input
                                    type='text'
                                    className='searchMarket'
                                    placeholder='Search...'
                                    onChange={(event) => handleChange(event)}
                                />
                                <SlMagnifier style={{color: '#FFFFFF', fontSize: '0.85em'}} />
                            </div>
                            <button className='btnBuy'>
                                Buy
                            </button>
                        </div>
                    </div>
                    <div className='marketListSpace'>
                        {filteredItems.map((item, index) => (
                            <li key={index} className='marketItemContainer'>
                                <img className='marketItemImg' src={item.image} alt='' />
                                <a className='marketItemClass'>{item.class}</a>
                                <a className='marketItemName'>{item.name}</a>
                                <div className='marketItemCostContainer'>
                                    <img className='marketCoinImg' src={coin} alt='' />
                                    <a className='marketItemCost'>{Math.round(item.cost / currProp)}</a>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Market;