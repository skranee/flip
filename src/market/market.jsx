import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import coin from '../imgs/currImg.png'
import { SlMagnifier } from "react-icons/sl";
import {observer} from "mobx-react";
import BuyModal from "./buyModal";
import SellModal from "./sellModal";


export const currProp = 2.5;

function Market() {
    const {store, globalStore} = useContext(Context);
    const [itemsValue, setItemsValue] = useState(0);
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState(items);
    const [itemBuying, setItemBuying] = useState({});
    const [itemSelling, setItemSelling] = useState({});
    const [itemsSale, setItemsSale] = useState([]);

    useEffect(() => {
        const getItems = async () => {
            const response = await store.getItemsMarket();
            if(response) {
                setItems(response);
            }
        }
        getItems();
    }, []);

    useEffect(() => {
        if(items) {
            setFilteredItems(items);
        }
    }, [items]);

    useEffect(() => {
        if (store.user && store.user.itemsList) {
            const value = store.user.itemsList.reduce((a, b) => a + b.price, 0);
            setItemsValue(Math.round(value / currProp));
        }
    }, [store.user.itemsList]);

    useEffect(() => {
        const getYourItems = async () => {
            const yourItems = await store.getItemsMarket();
            const filtered = yourItems.filter(item => item.owner === store.user.id);
            console.log(yourItems);
        }
        if(store.user && store.isAuth) {
            getYourItems();
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

    // const addItem = async () => {
    //     await store.addItemMarket(
    //         items[9].name,
    //         '658fe5c64e467dcdd16a740d',
    //         'legendary',
    //         items[9].classification,
    //         items[9].price,
    //         items[9].image
    //     )
    // }

    const chooseItem = (item) => {
        setItemBuying(item);
        globalStore.setBuyOpen(true);
    }

    const openSell = () => {
        globalStore.setSellOpen(true);
    }

    const handleBlur = () => {
        globalStore.setSellOpen(false);
    }

    const setItemSell = (item) => {
        setItemSelling(item);
        globalStore.setSellItemOpen(true);
    }

    return (
        <div>
            <div className='background' />
            <div className='marketPage'>
                {globalStore.sellOpen &&
                    <div className='backgroundModal' onClick={handleBlur}>
                        <div className='modalWindowDeposit' onClick={(event) => event.stopPropagation()}>
                            <div className='depositInventory' style={{maxHeight: '95%'}}>
                                {store.user.itemsList.length ?
                                    store.user.itemsList.map((item, index) => (
                                        <li key={index}
                                            className='marketItemContainer'
                                            style={{flexBasis: 'calc(30% - 15px)'}}
                                            onClick={() => setItemSell(item)}
                                        >
                                            <img className='marketItemImg' src={item.image} alt='' />
                                            <a className='marketItemClass'>{item.classification}</a>
                                            <a className='marketItemName'>{item.name}</a>
                                            <div className='marketItemCostContainer'>
                                                <img className='marketCoinImg' src={coin} alt='' />
                                                <a className='marketItemCost'>{Math.round(item.price / currProp)}</a>
                                            </div>
                                        </li>
                                    )) :
                                    <div className='marketItemContainer'
                                         style={
                                             {
                                                 flexBasis: '100%',
                                                 display: "flex",
                                                 justifyContent: "center",
                                                 alignItems: "center",
                                                 cursor: "default",
                                                 pointerEvents: "none",
                                                 minHeight: 250
                                             }}>
                                        <a className='noItemsText'>No items to sell...</a>
                                    </div>
                                }
                            </div>
                            {globalStore.sellItemOpen &&
                                <SellModal item={itemSelling} />
                            }
                        </div>
                    </div>
                }
                {globalStore.itemsOnSale &&
                    <div className='backgroundModal' onClick={() => globalStore.setItemsOnSale(false)}>
                        <div className='modalWindowDeposit' onClick={(event) => event.stopPropagation()}>
                            <div className='depositInventory' style={{maxHeight: '95%'}}>
                                {store.user && store.isAuth && store.user.itemsList.length ?
                                    store.user.itemsList.map((item, index) => (
                                        <li key={index}
                                            className='marketItemContainer'
                                            style={{flexBasis: 'calc(30% - 15px)'}}
                                            onClick={() => setItemSell(item)}
                                        >
                                            <img className='marketItemImg' src={item.image} alt='' />
                                            <a className='marketItemClass'>{item.classification}</a>
                                            <a className='marketItemName'>{item.name}</a>
                                            <div className='marketItemCostContainer'>
                                                <img className='marketCoinImg' src={coin} alt='' />
                                                <a className='marketItemCost'>{Math.round(item.price / currProp)}</a>
                                            </div>
                                        </li>
                                    )) :
                                    <div className='marketItemContainer'
                                         style={
                                             {
                                                 flexBasis: '100%',
                                                 display: "flex",
                                                 justifyContent: "center",
                                                 alignItems: "center",
                                                 cursor: "default",
                                                 pointerEvents: "none",
                                                 minHeight: '95%'
                                             }}>
                                        <a className='noItemsText'>{store.isAuth ? 'You have no items on sale...' : 'Not authorized...'}</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
                <div className='marketContainer'>
                    {globalStore.buyOpen &&
                        <BuyModal item={itemBuying} />
                    }
                    <div className='marketUpperPanel'>
                        <div className='marketItemsValue'>
                            <a>Items Value:</a>
                            <img className='marketCoinImg' src={coin} alt=''/>
                            <a>{itemsValue}</a>
                        </div>
                        <a className='yourSellsText' onClick={() => globalStore.setItemsOnSale(true)}>ITEMS ON SALE</a>
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
                            {/*<button className='btnBuy' onClick={() => buy()}>*/}
                            {/*    Buy*/}
                            {/*</button>*/}
                            <button className='btnBuy' onClick={openSell}>
                                Sell
                            </button>
                        </div>
                    </div>
                    <div className='marketListSpace'>
                        {filteredItems.map((item, index) => (
                            <li key={index}
                                className='marketItemContainer'
                                onClick={() => chooseItem(item)}
                            >
                                <img className='marketItemImg' src={item.image} alt='' />
                                <a className='marketItemClass'>{item.classification}</a>
                                <a className='marketItemName'>{item.name}</a>
                                <div className='marketItemCostContainer'>
                                    <img className='marketCoinImg' src={coin} alt='' />
                                    <a className='marketItemCost'>{Math.round(item.price / currProp)}</a>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(Market);