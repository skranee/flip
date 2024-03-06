import React, {useContext} from 'react';
import { ImProfile } from "react-icons/im";
import { CiMoneyBill } from "react-icons/ci";
import { FaArrowUp } from "react-icons/fa";
import { TbMedal } from "react-icons/tb";
import { IoPeople } from "react-icons/io5";
import { CiStreamOn } from "react-icons/ci";
import { SiBitcoinsv } from "react-icons/si";
import { FaBan } from "react-icons/fa";
import {Context} from "../index";

function OptionsList() {
    const {store, globalStore} = useContext(Context);

    const openModal = (status) => {
        globalStore.setAdminOptionStatus(status);
        globalStore.setAdminModal(true);
    }

    return (
        <>
            <li className='optionContainer' onClick={() => openModal('ROLE CHANGE')}>
                <ImProfile className='iconAdmin'/>
                <a className='adminText'>ROLE</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('BALANCE ADD')}>
                <CiMoneyBill className='iconAdmin'/>
                <a className='adminText'>+BALANCE</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('BALANCE REDUCE')}>
                <CiMoneyBill className='iconAdmin'/>
                <a className='adminText'>-BALANCE</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('LEVEL MANAGEMENT')}>
                <FaArrowUp className='iconAdmin'/>
                <a className='adminText'>LEVEL</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('ONLINE MANAGEMENT')}>
                <IoPeople className='iconAdmin'/>
                <a className='adminText'>ONLINE</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('POPUP')}>
                <CiStreamOn className='iconAdmin'/>
                <a className='adminText'>POPUP</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('PAYMENTS')}>
                <SiBitcoinsv className='iconAdmin'/>
                <a className='adminText'>PAYMENTS</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('BAN / UNBAN')}>
                <FaBan className='iconAdmin'/>
                <a className='adminText'>BAN / UNBAN</a>
            </li>
            <li className='optionContainer' onClick={() => openModal('REWARD')}>
                <TbMedal className='iconAdmin'/>
                <a className='adminText'>ADD REWARD</a>
            </li>
        </>
    )
}

export default OptionsList;