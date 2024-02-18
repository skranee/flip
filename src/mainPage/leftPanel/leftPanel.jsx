import React, {useContext, useState} from "react";
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

function LeftPanel () {
    const {store, globalStore} = useContext(Context);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [bonus, setBonus] = useState(store.user.gotReward)

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
                        {bonus &&
                            <div className='claimBonus'>
                                <img className='imgPanel' src={claimImg} alt='' />
                                <a className='bonusImg'>NEW<br/>BONUS!</a>
                                <button className='claimBtn' onClick={() => claim()}>
                                    Claim
                                </button>
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