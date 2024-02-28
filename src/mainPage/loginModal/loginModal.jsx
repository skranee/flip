import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import axios from "axios";
import {observer} from "mobx-react";
import {useNavigate} from "react-router-dom";

function LoginModal () {
    const {globalStore} = useContext(Context)
    const [checked, setChecked] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [verify, setVerify] = useState(false);
    const [verifyBio, setVerifyBio] = useState('☕👉☔️☔️🤯☕')
    const [verStatus, setVerStatus] = useState('')
    const navigate = useNavigate();

    const {store} = useContext(Context)

    useEffect(() => {
        if(!checked || !username || !username.trim()) {
            setIsDisabled(true)
        }
        else {
            setIsDisabled(false)
        }
    }, [checked, username]);

    const handleNavigate = (page) => {
        navigate(page);
        globalStore.setLogOpen(false);
    }

    const getUserInfo = async () => {
        if(!isDisabled) {
            try {
                const userData = await store.getUser(username);
                const user = userData.data.user;

                if (!user || !user.id) {
                    console.error('Error: User not found');
                    return;
                }

                setUserId(user.id);
                setUserInfo(user);
                setVerify(true);
            } catch (error) {
                console.error('Error fetching user information', error);
            }
        }
    };

    const handleVerify = async () => {
        try {
            const bio = await store.getBio(userId);
            await getAvatar()
            if(verifyBio === bio) {
                store.setAuth(true);
                globalStore.setLogOpen(false);
                const save = await store.saveToDb(userInfo);
            } else {
                setVerStatus('Your description does not match');
                localStorage.removeItem('username');
                localStorage.removeItem('avatarUrl');
            }
        } catch (error) {
            console.error('The description does not match!', error)
        }
    };

    const getAvatar = async () => {
        const avatar = await store.getAvatar(userId);
        store.setAvatar(avatar);
        localStorage.setItem('avatarUrl', avatar);
        localStorage.setItem('username', userInfo.name);
    }

    const handleBlur = () => {
        globalStore.setLogOpen(false)
    }

    const handleCheckboxChange = () => {
        setChecked(!checked);
        ifDisabled()
    }

    const handleChange = (userName) => {
        setUsername(userName);
        ifDisabled()
    }

    const ifDisabled = () => {
        if(!username || !username.trim()) {
            setIsDisabled(true);
        }
        if(!checked) {
            setIsDisabled(true);
        }
        setIsDisabled(false)
    }

    return (
        <div className='backgroundModal' onClick={() => handleBlur()}>
            <div className='modalWindow' onClick={(event) => event.stopPropagation()}>
                <p className='logTitle'>Login with username</p>
                <input
                    type='text'
                    className='loginInput'
                    placeholder='Enter username...'
                    value={username}
                    minLength='3'
                    maxLength='35'
                    onChange={(event) => handleChange(event.target.value)}
                />
                <label className={`custom-checkbox ${checked ? 'checked' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={handleCheckboxChange} style={{display: 'none'}}/>
                </label>
                <p className='agreement'> I agree with
                    <a
                        className='tosLabelLogin'
                        onClick={() => handleNavigate('/tos')}> terms of use
                    </a>
                </p>
                {verStatus && <a className='verStatus'>{verStatus}</a>}
                {verify ?
                    <>
                        <div className='verifyContainer'>{verifyBio}</div>
                        <button className='btnLogin' onClick={handleVerify}>Verify</button>
                    </>
                    :
                    <button className='btnLogin' disabled={isDisabled} onClick={getUserInfo}>
                        Login
                    </button>
                }
            </div>
        </div>
    )
}

export default observer(LoginModal);