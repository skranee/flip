import React, {useContext, useEffect, useState} from "react";
import { CgGames } from "react-icons/cg";
import { BiSolidDownArrow } from "react-icons/bi/index.esm";
import { BiSolidUpArrow } from "react-icons/bi/index.esm";
import Dropdown from "./dropdown";
import { IoMdTrophy } from "react-icons/io/index.esm";
import { GiRibbonMedal } from "react-icons/gi/index.esm";
import { AiFillShop } from "react-icons/ai/index.esm";
import { AiFillWechat } from "react-icons/ai/index.esm";
import claimImg from './claimImg.png'
import { BiArrowToLeft } from "react-icons/bi/index.esm";
import { BiArrowToRight } from "react-icons/bi/index.esm";
import {useNavigate} from "react-router-dom";
import {Context} from "../../index";
import {observer} from "mobx-react";
import { FaTools } from "react-icons/fa";
import gem from '../../imgs/currImg.png';
import {participateFunction} from "../../chat/chat";

function LeftPanel () {
    const {store, globalStore} = useContext(Context);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [bonus, setBonus] = useState(store.user.gotReward)
    const [participateDisabled, setParticipateDisabled] = useState(false);

    useEffect(() => {
        if(store.user && store.user.id && store.user.gamesPlayed > 0) {
            const check = async () => {
                const list = await store.get24hours();
                if(list && list.data) {
                    const included = list.data.find(item => (item.player1 === store.user.id || item.player2 === store.user.id))
                    if(included) {
                        globalStore.setAllowedToParticipate(true);
                    } else {
                        globalStore.setAllowedToParticipate(false);
                    }
                } else {
                    globalStore.setAllowedToParticipate(false);
                }
            }
            check();
        }
    }, [store.user.gamesPlayed, store, globalStore]);

    useEffect(() => {
        if(globalStore.giveawayParticipants && globalStore.giveawayParticipants.length) {
            const check = globalStore.giveawayParticipants.filter(username => username === store.user.username);
            if(check.length > 0) {
                setParticipateDisabled(true);
            } else {
                setParticipateDisabled(false);
            }
        } else {
            setParticipateDisabled(false);
        }
    }, [globalStore.giveawayParticipants, store.user.username])

    useEffect(() => {
        setBonus(store.user.gotReward);
    }, [store.user]);

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const closePanel = () => {
        globalStore.setPanelOpen(false)
    }

    const openPanel = () => {
        globalStore.setPanelOpen(true)
    }

    const handleNavigate = (path) => {
        navigate(path)
    }

    const claim = async () => {
        await store.claim();
        setBonus(true);
    }

    const participate = () => {
        if(globalStore.allowedToParticipate === false) {
            globalStore.setErrorMessage('Must have at least 1 coin flip in last 24 hours');
            globalStore.setSeeGiveaway(false);
            globalStore.setErrorWindow(true);
        }
        if(globalStore.allowedToParticipate === true) {
            participateFunction();
        }
    }

    return (
        <div>
            <>
                {globalStore.seeGiveaway &&
                    <div className='backgroundModal' onClick={() => globalStore.setSeeGiveaway(false)}>
                        <div className='giveawayContainer' onClick={(event) => event.stopPropagation()}>
                            <div className='giveawayUpperPanel'>
                                {!globalStore.giveawayWinner &&
                                    <>
                                        <span>{globalStore.giveawayData.timer}</span>
                                        <span>
                                                Checked: {(globalStore.giveawayParticipants && globalStore.giveawayParticipants.length) ?
                                            globalStore.giveawayParticipants.length : 0}
                                            </span>
                                    </>
                                }
                                {globalStore.giveawayWinner &&
                                    <span
                                        style={{fontSize: '0.9em'}}>Winner: {globalStore.giveawayWinner}</span>
                                }
                            </div>
                            <div className='giveawayListHorizontal'
                                 style={{
                                     justifyContent:
                                         (globalStore.giveawayData.items.length === 1
                                             || globalStore.giveawayData.items.length === 2) ?
                                             "center" : "flex-start"
                                 }}
                            >
                                {(globalStore.giveawayData && globalStore.giveawayData.items && globalStore.giveawayData.items.length) &&
                                    globalStore.giveawayData.items.map((item, index) => (
                                        <li key={index} className='horizontalItemContainer'>
                                            <img
                                                className='imgHorizontalItem'
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        </li>
                                    ))
                                }
                            </div>
                            <span className='totalValueGiveaway'>
                                    Total value: <img className='gemWorth' src={gem}
                                                      alt='gem'/> {Math.round(globalStore.giveawayData.totalValue)}
                                </span>
                            {(!participateDisabled && store.user && store.user.id) &&
                                <button className='btnParticipate' onClick={participate}>
                                    Participate
                                </button>
                            }
                        </div>
                    </div>
                }
                <div className='leftPanel'
                     style={{width: globalStore.panelOpen ? '' : 0, paddingLeft: globalStore.panelOpen ? 5 : 0}}>
                    <div className='leftPContent'>
                        <div className='titleContainer'>
                            <p className='titleField'>GAMES</p>
                            <BiArrowToLeft className='closePanel' onClick={closePanel} />
                        </div>
                        <div className='gameSelDD' onClick={handleDropdown}>
                            <div className='gamesSelector'>
                                <div className='gsLeft'>
                                    <CgGames className='gamePad' />
                                    <span className='gameName'> Games </span>
                                </div>
                                <div className='dropdownArrowDiv'>
                                    <div className='dropdownGames'>
                                        {dropdownOpen ? <BiSolidUpArrow className='dropdownArrow' />
                                            : <BiSolidDownArrow className='dropdownArrow' />}
                                        </div>
                                    </div>
                                </div>
                                {dropdownOpen && <Dropdown />}
                            </div>
                        <p className='titleField'>REWARDS</p>
                        <div className='menuProp' onClick={() => handleNavigate('/rewards')}>
                            <IoMdTrophy/>
                            <span> Level Rewards </span>
                        </div>
                        <div className='menuProp' onClick={() => handleNavigate('/leaders')}>
                            <GiRibbonMedal />
                            <span> Leaderboard </span>
                        </div>
                        <p className='titleField'>MARKETPLACE</p>
                        <div className='menuProp' onClick={() => handleNavigate('/market')}>
                            <AiFillShop />
                            <span > Market </span>
                        </div>
                        <div className='menuProp' onClick={() => handleNavigate('/support')}>
                            <AiFillWechat />
                            <span> Support </span>
                        </div>
                        {store.user.role === 'admin' &&
                            <div className='menuProp' onClick={() => handleNavigate('/admin')}>
                                <FaTools />
                                <span> Admin Panel </span>
                            </div>
                        }
                        {bonus === false &&
                            <div className='claimBonus'>
                                <img className='imgPanel' src={claimImg} alt='' />
                                <span className='bonusImg'>NEW<br/>BONUS!</span>
                                <button className='claimBtn' onClick={() => claim()}>
                                    Claim
                                </button>
                            </div>
                        }
                        {(globalStore.giveawayGoing === true && globalStore.giveawayData && !globalStore.seeGiveaway) &&
                            !globalStore.giveawayWinner &&
                            <div className='giveawayAnnounceContainer'>
                                <span className='giveawayTextAnnouncement'>LIVE GIVEAWAY!</span>
                                <button className='seeGiveaway' onClick={() => globalStore.setSeeGiveaway(true)}>
                                    JOIN
                                </button>
                                <img alt='MM2' className='backgroundGemGiveaway' src='/logo.png'/>
                            </div>
                        }
                        {(globalStore.giveawayGoing === true && globalStore.giveawayData && !globalStore.seeGiveaway) &&
                            globalStore.giveawayWinner &&
                            <div
                                className='giveawayContainer'
                                 onClick={(event) => event.stopPropagation()}
                                style={{
                                    width: '95%',
                                    height: 180
                                }}
                            >
                                <div className='giveawayUpperPanel'>
                                    {globalStore.giveawayWinner &&
                                        <span
                                            style={{fontSize: '0.9em'}}>Winner: {globalStore.giveawayWinner}</span>
                                    }
                                </div>
                                <div className='giveawayListHorizontal'
                                     style={{
                                         justifyContent:
                                             (globalStore.giveawayData.items.length === 1
                                                 || globalStore.giveawayData.items.length === 2) ?
                                                 "center" : "flex-start"
                                }}
                                >
                                    {(globalStore.giveawayData && globalStore.giveawayData.items && globalStore.giveawayData.items.length) &&
                                        globalStore.giveawayData.items.map((item, index) => (
                                            <li key={index} className='horizontalItemContainer'>
                                                <img
                                                    className='imgHorizontalItem'
                                                    src={item.image}
                                                    alt={item.name}
                                                />
                                            </li>
                                        ))
                                    }
                                </div>
                                <span className='totalValueGiveaway'>
                                    Total value: <img className='gemWorth' src={gem} alt='gem'/> {Math.round(globalStore.giveawayData.totalValue)}
                                </span>
                                {(!participateDisabled && store.user && store.user.id) &&
                                    <button className='btnParticipate' onClick={participate}>
                                        Participate
                                    </button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </>
            {!globalStore.panelOpen &&
                <div className='openPanel'>
                    <BiArrowToRight onClick={openPanel}/>
                </div>
            }
        </div>
    )
}

export default observer(LeftPanel);