import React, {useContext} from 'react';
import { ImProfile } from "react-icons/im";
import { CiMoneyBill } from "react-icons/ci";
import { FaArrowUp } from "react-icons/fa";
import { TbMedal } from "react-icons/tb";
import { IoPeople } from "react-icons/io5";
import { CiStreamOn } from "react-icons/ci";
import { SiBitcoinsv } from "react-icons/si";
import { FaBan } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import {Context} from "../index";

function OptionsList() {
    const {globalStore} = useContext(Context);

    const openModal = (status) => {
        globalStore.setAdminOptionStatus(status);
        if(status !== 'GIVEAWAY') {
            globalStore.setAdminModal(true);
        }
    }

    return (
        <>
            <li className='optionContainer' onClick={() => openModal('ROLE CHANGE')}>
                <ImProfile className='iconAdmin'/>
                <span className='adminText'>ROLE</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('BALANCE ADD')}>
                <CiMoneyBill className='iconAdmin'/>
                <span className='adminText'>+BALANCE</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('BALANCE REDUCE')}>
                <CiMoneyBill className='iconAdmin'/>
                <span className='adminText'>-BALANCE</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('LEVEL MANAGEMENT')}>
                <FaArrowUp className='iconAdmin'/>
                <span className='adminText'>LEVEL</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('ONLINE MANAGEMENT')}>
                <IoPeople className='iconAdmin'/>
                <span className='adminText'>ONLINE</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('POPUP')}>
                <CiStreamOn className='iconAdmin'/>
                <span className='adminText'>POPUP</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('PAYMENTS')}>
                <SiBitcoinsv className='iconAdmin'/>
                <span className='adminText'>PAYMENTS</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('BAN / UNBAN')}>
                <FaBan className='iconAdmin'/>
                <span className='adminText'>BAN / UNBAN</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('REWARD')}>
                <TbMedal className='iconAdmin'/>
                <span className='adminText'>ADD REWARD</span>
            </li>
            <li className='optionContainer' onClick={() => openModal('GIVEAWAY')}>
                <FaGift className='iconAdmin' />
                <span className='adminText'>GIVEAWAY</span>
            </li>
        </>
    )
}

export default OptionsList;