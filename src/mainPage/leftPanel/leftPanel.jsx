import React, {useState} from "react";
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

function LeftPanel () {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [panelOpen, setPanelOpen] = useState(true)

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const closePanel = () => {
        setPanelOpen(false)
    }

    const openPanel = () => {
        setPanelOpen(true)
    }

    return (
        <div>
            {panelOpen ? <>
                    <div className='leftPanel'>
                        <BiArrowToLeft className='closePanel' onClick={closePanel} />
                        <p className='titleField'>GAMES</p>
                        <div className='gamesSelector'>
                            <CgGames className='gamePad' />
                            <a className='gameName'> Games </a>
                            <div className='dropdownGames' onClick={handleDropdown}>
                                {dropdownOpen ? <BiSolidUpArrow className='dropdownArrow' />
                                    : <BiSolidDownArrow className='dropdownArrow' />}
                            </div>
                            {dropdownOpen ? <Dropdown /> : <div/>}
                        </div>
                        <p className='titleField' style={{top: '9%'}}>REWARDS</p>
                        <div className='titleMenu'>
                            <div className='menuProp' style={{top: '23%'}}>
                                <IoMdTrophy/>
                                <a> Level Rewards </a>
                            </div>
                            <div className='menuProp'style={{top: '27%'}}>
                                <GiRibbonMedal />
                                <a> Weekly Race </a>
                            </div>
                            <p className='titleField' style={{top: '25%'}}>MARKETPLACE</p>
                            <div className='menuProp'style={{top: '38%'}}>
                                <AiFillShop />
                                <a> Shop </a>
                            </div>
                            <div className='menuProp'style={{top: '42%'}}>
                                <AiFillWechat />
                                <a> Support </a>
                            </div>
                        </div>
                        <img className='imgPanel' src={claimImg} alt='' />
                        <a className='bonusImg'>NEW<br/>BONUS!</a>
                        <button className='claimBtn'>
                            Claim
                        </button>
                    </div>
                </> :
                <div className='openPanel'>
                    <BiArrowToRight onClick={openPanel}/>
                </div>
            }
        </div>
    )
}

export default LeftPanel;