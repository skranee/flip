import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import coin from '../imgs/currImg.png'
import { SlMagnifier } from "react-icons/sl";
import {observer} from "mobx-react";
import BuyModal from "./buyModal";
import SellModal from "./sellModal";
import CancelModal from "./cancelModal";
// import {items} from "../mainPage/playzone/gamesInfo";


export const currProp = 2.5;

function Market() {
    const {store, globalStore} = useContext(Context);
    const [itemsValue, setItemsValue] = useState(0);
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState(items);
    const [itemBuying, setItemBuying] = useState({});
    const [itemSelling, setItemSelling] = useState({});
    const [itemCancelling, setItemCancelling] = useState({});

    useEffect(() => {
        const getItems = async () => {
            const response = await store.getItemsMarket();
            if(response) {
                setItems(response.data);
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
        if (store.user && store.itemsList && store.itemsList.length) {
            const value = store.itemsList.reduce((a, b) => a + b.price, 0);
            setItemsValue(Math.round(value / currProp));
        }
    }, [items, store.itemsList]);

    const containerWidth = () => {
        if(!globalStore.chatOpened && globalStore.panelOpen) {
            return '84.5%'
        }
        else if(!globalStore.chatOpened && !globalStore.panelOpen) {
            return '97.5%'
        }
        else if(globalStore.chatOpened && !globalStore.panelOpen) {
            return '81%'
        }
        else {
            return '68%'
        }
    }

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

    const openSell = async () => {
        const items = await store.getUserItems(store.user.id);
        globalStore.setSellOpen(true);
    }

    const handleBlur = () => {
        globalStore.setSellOpen(false);
    }

    const setItemSell = (item) => {
        setItemSelling(item);
        globalStore.setSellItemOpen(true);
    }

    const setItemCancel = (item) => {
        setItemCancelling(item);
        globalStore.setCancelSale(true);
    }

    const add = async () => {
        await store.addItemBot(store.user.robloxId, {
            name: items[0].name,
            rarity: items[0].rarity,
            classification: items[0].classification,
            image: items[0].image,
            price: items[0].price
        });
        // const success = await store.checkOwnership(store.user.robloxId, item);
        // console.log(success.data)
    }

    return (
        <div>
            <div className='background' />
            <div className='marketPage'>
                {globalStore.sellOpen &&
                    <div className='backgroundModal' onClick={handleBlur}>
                        {globalStore.sellItemOpen &&
                            <SellModal item={itemSelling} />
                        }
                        <div className='modalWindowDeposit' onClick={(event) => event.stopPropagation()} style={{justifyContent: "flex-start"}}>
                            <div className='marketItemsValue'>
                                <a>Items Value:</a>
                                <img className='marketCoinImg' src={coin} alt=''/>
                                <a>{itemsValue}</a>
                            </div>
                            <div className='depositInventory' style={{maxHeight: '95%'}}>
                                {store.itemsList.length ?
                                    store.itemsList.map((item, index) => (
                                        <li key={index}
                                            className='marketItemContainer'
                                            style={{flexBasis: 'calc(50% - 15px)'}}
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
                        </div>
                    </div>
                }
                {globalStore.itemsOnSale &&
                    <div className='backgroundModal' onClick={() => globalStore.setItemsOnSale(false)}>
                        {globalStore.cancelSale &&
                            <CancelModal item={itemCancelling} />
                        }
                        <div className='modalWindowDeposit' onClick={(event) => event.stopPropagation()}>
                            <div className='depositInventory' style={{maxHeight: '95%'}}>
                                {store.user && store.isAuth && items.filter(item => item.owner === store.user.id).length ?
                                    items.filter(item => item.owner === store.user.id).map((item, index) => (
                                        <li key={index}
                                            className='marketItemContainer'
                                            style={{flexBasis: "calc(45% - 5px)"}}
                                            onClick={() => setItemCancel(item)}
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
                <div className='marketContainer' style={{
                    width: containerWidth(),
                    marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                }}>
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