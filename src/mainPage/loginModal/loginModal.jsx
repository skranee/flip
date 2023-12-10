import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import axios from "axios";
import {observer} from "mobx-react";

function LoginModal () {
    const {globalStore} = useContext(Context)
    const [showTerms, setShowTerms] = useState(false) //do later
    const [checked, setChecked] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [userBio, setUserBio] = useState('');
    const [verify, setVerify] = useState(false);
    const [verifyBio, setVerifyBio] = useState('mm2flip cool mate cat party walk far away')
    const [verStatus, setVerStatus] = useState('')

    const {store} = useContext(Context)

    useEffect(() => {
        if(!checked || !username || !username.trim()) {
            setIsDisabled(true)
        }
        else {
            setIsDisabled(false)
        }
    }, [checked, username]);

    const getUserInfo = async () => {
        try {
            const response = await axios.post(`http://localhost:7000/api/getUser`, {username});
            const {user} = response.data;

            if (!user) {
                console.error('Error: User not found');
                return;
            }

            setUserId(user.id);
            setUserInfo(user);
            setUserBio(user);
            setVerify(true);
        } catch (error) {
            console.error('Error fetching user information', error);
        }
    };

    const handleVerify = async () => {
        try {
            const bio = await axios.get(`http://localhost:7000/api/getUserDescription?userId=${userId}`);
            if(verifyBio === bio.data) {
                store.setAuth(true);
                globalStore.setLogOpen(false);
                const save = await axios.post('http://localhost:7000/api/saveToDB', {userInfo});
                console.log(save.status)
                const avatar = await axios.get(`http://localhost:7000/api/getUserAvatar?userId=${userId}`);
                localStorage.setItem('avatarUrl', avatar.data);
                localStorage.setItem('username', userInfo.name)
            } else {
                setVerStatus('Your description does not match');
            }
        } catch (error) {
            console.error('The description does not match!', error)
        }
    };

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

    const goToTerms = () => {
        setShowTerms(true)
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
                        style={{color: '#EB0000', cursor: 'pointer'}}
                        onClick={() => goToTerms()}> terms of use
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