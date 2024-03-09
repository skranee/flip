import React, {useContext, useEffect, useRef, useState} from "react";
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
    }, [store.user.gamesPlayed, ]);

    const socket = useRef()
    socket.current = new WebSocket('ws://localhost:4000');

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
    }, [globalStore.giveawayParticipants, ])

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
        const claim = await store.claim(store.user.id);
        setBonus(true);
    }

    const participate = () => {
        if(globalStore.allowedToParticipate === false) {
            globalStore.setErrorMessage('Must have at least 1 coin flip in last 24 hours');
            globalStore.setErrorWindow(true);
        }
        if(globalStore.allowedToParticipate === true) {
            socket.current.send(JSON.stringify({
                method: 'participate',
                user: store.user
            }))
        }
    }

    return (
        <div>
            <>
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
                                    <a className='gameName'> Games </a>
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
                            <a> Level Rewards </a>
                        </div>
                        <div className='menuProp' onClick={() => handleNavigate('/leaders')}>
                            <GiRibbonMedal />
                            <a> Leaderboard </a>
                        </div>
                        <p className='titleField'>MARKETPLACE</p>
                        <div className='menuProp' onClick={() => handleNavigate('/market')}>
                            <AiFillShop />
                            <a > Market </a>
                        </div>
                        <div className='menuProp' onClick={() => handleNavigate('/support')}>
                            <AiFillWechat />
                            <a> Support </a>
                        </div>
                        {store.user.role === 'admin' &&
                            <div className='menuProp' onClick={() => handleNavigate('/admin')}>
                                <FaTools />
                                <a> Admin Panel </a>
                            </div>
                        }
                        {bonus === false &&
                            <div className='claimBonus'>
                                <img className='imgPanel' src={claimImg} alt='' />
                                <a className='bonusImg'>NEW<br/>BONUS!</a>
                                <button className='claimBtn' onClick={() => claim()}>
                                    Claim
                                </button>
                            </div>
                        }
                        {(globalStore.giveawayGoing === true && globalStore.giveawayData) &&
                            <div className='giveawayContainer'>
                                <div className='giveawayUpperPanel'>
                                    {!globalStore.giveawayWinner &&
                                        <>
                                            <a>{globalStore.giveawayData.timer}</a>
                                            <a>
                                                Checked: {(globalStore.giveawayParticipants && globalStore.giveawayParticipants.length) ?
                                                globalStore.giveawayParticipants.length : 0}
                                            </a>
                                        </>
                                    }
                                    {globalStore.giveawayWinner &&
                                        <a style={{fontSize: '0.9em'}}>Winner: {globalStore.giveawayWinner}</a>
                                    }
                                </div>
                                <div className='giveawayListHorizontal'
                                     style={{justifyContent:
                                             (globalStore.giveawayData.items.length === 1
                                                 || globalStore.giveawayData.items.length === 2) ?
                                                    "center" : "flex-start"}}
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
                                <a className='totalValueGiveaway'>
                                    Total value: <img className='gemWorth' src={gem}
                                                      alt='gem'/> {Math.round(globalStore.giveawayData.totalValue)}
                                </a>
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