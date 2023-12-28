import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react";
import { FaPenSquare } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";

const clientUrl = 'http://localhost:3000'

function Profile() {
    const {store} = useContext(Context);
    const [afUsers, setAfUsers] = useState(0);
    const [afBalance, setAfBalance] = useState(0);
    const [afCode, setAfCode] = useState('code');
    const afLink = `${clientUrl}/a/${afCode}`
    const [change, setChange] = useState(false);
    const [value, setValue] = useState(afCode)

    useEffect(() => {
        const getAffiliate = async () => {
            if (store.user && store.user.id) {
                store.setLoading(true);
                const system = await store.getAffiliate(store.user.id);
                if (system.data) {
                    setAfUsers(system.data.affiliatedUsers);
                    setAfBalance(system.data.affiliatedBalance);
                    setAfCode(system.data.affiliateCode);
                    setValue(system.data.affiliateCode);
                }
            }
        }
        getAffiliate();
        store.setLoading(false);
    }, []);


    const handleCode = () => {
        setChange(true);
    }

    const handleCancel = () => {
        setChange(false);
    }

    const handleSave = async () => {
        if(value !== afCode) {
            setAfCode(value);
            await store.createAffiliate(value, store.user.id);
            setChange(false);
        }
        else {
            //...
        }
    }

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
        <div>
            <div className='background' />
            <div className='profilePage'>
                <div className='profileContainer'>
                    <div className='profileInfo'>
                        <div className='innerInfoContainer'>
                            <img className='avatarProfile' src={localStorage.getItem('avatarUrl')} alt='' />
                            <div className='innerData'>
                                <a className='usernameProfile'>{store.user.username}</a>
                                <a className='registerDate'>Registration date: {store.user.regDate}</a>
                                <a className='userID'>Roblox ID: {store.user.robloxId}</a>
                            </div>
                        </div>
                        <div className='outerInfoContainer'>
                            <a className='outerInfo'>Games played:</a>
                            <a className='outerInfoNum'>{store.user.gamesPlayed}</a>
                            <a className='outerInfo'>Total wagered:</a>
                            <a className='outerInfoNum'>{store.user.totalWagered} R$</a>
                            <a className='outerInfo'>Total withdrawn:</a>
                            <a className='outerInfoNum'>{store.user.totalWithdrawn} R$</a>
                            <a className='outerInfo'>Total deposited:</a>
                            <a className='outerInfoNum'>{store.user.totalDeposited} R$</a>
                        </div>
                    </div>
                    <div className='affiliateInfo'>
                        <a className='affiliatedInfo'>Affiliated users</a>
                        <a className='affiliatedInfoNum'>{afUsers}</a>
                        <a className='affiliatedInfo'>Affiliated balance</a>
                        <a className='affiliatedInfoNum'>{afBalance}</a>
                        <a className='affiliatedInfo'>Affiliate code</a>
                        <div>
                            {change ?
                                <div className='codeContainer'>
                                    <input
                                        className='afCode'
                                        type='text'
                                        value={value}
                                        onChange={(event) => handleChange(event)}
                                        maxLength='15'
                                        minLength='3'
                                    />
                                    <FaSave className='btnSave' onClick={handleSave}/>
                                    <MdOutlineCancelPresentation className='btnCancel' onClick={() => handleCancel()}/>
                                </div>
                            :
                                <div className='codeContainer'>
                                    <a className='affiliatedInfoNum'>{afCode}</a>
                                    <FaPenSquare className='btnPen' onClick={() => handleCode()} />
                                </div>
                            }
                        </div>
                        <a className='affiliatedInfo'>Affiliate link</a>
                        <a
                            className='affiliatedInfoNum'
                            // style={{border: 'solid 2px rgba(110, 110, 110, 0.5)', borderRadius: 5, padding: '3px 0 3px 0'}}
                        >
                            {afLink}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(Profile);