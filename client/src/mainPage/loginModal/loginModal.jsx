import React, {useContext, useEffect, useRef, useState} from "react";
import {Context} from "../../index";
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
    const [verifyBio, setVerifyBio] = useState('cool mate cat party walk far away')
    const [verStatus, setVerStatus] = useState('')
    const navigate = useNavigate();
    const [clickInside, setClickInside] = useState(false);
    const modalRef = useRef();

    const {store} = useContext(Context)

    useEffect(() => {
        if(!checked || !username || !username.trim()) {
            setIsDisabled(true)
        }
        else {
            setIsDisabled(false)
        }
    }, [checked, username, ]);

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
                    globalStore.setLogOpen(false);
                    setUsername('');
                    globalStore.setErrorMessage('Error: User not found');
                    globalStore.setErrorWindow(true);
                    return;
                }

                if(userData && userData.data && userData.data.description) {
                    setVerifyBio(userData.data.description);
                }

                setUserId(user.id);
                setUserInfo(user);
                setVerify(true);
            } catch (error) {
                globalStore.setLogOpen(false);
                setUsername('');
                globalStore.setErrorMessage('Error: User not found');
                globalStore.setErrorWindow(true);
            }
        }
    };

    const handleVerify = async () => {
        try {
            const response = await store.verifyDescription(username);

            if(response && response.data && response.data.match && response.data.match === 'failed') {
                setVerStatus('Your description does not match');
                setUsername('');
                setVerify(false);
                localStorage.removeItem('username');
                localStorage.removeItem('avatarUrl');
            } else {
                await getAvatar()
                store.setAuth(true);
                globalStore.setLogOpen(false);
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

    const handleEnter = async (event) => {
        if(event.key === 'Enter' && !isDisabled) {
            if(verify) {
                await handleVerify();
            } else if(!verify) {
                await getUserInfo();
            }
        }
    }

    const handleMouseDown = (event) => {
        if (modalRef.current && modalRef.current.contains(event.target)) {
            setClickInside(true)
        }
        else {
            setClickInside(false);
        }
    };

    const handleMouseUp = () => {
        if(clickInside) {
            globalStore.setLogOpen(true);
        }
        else {
            globalStore.setLogOpen(false)
            setClickInside(false)
        }
    };

    return (
        <div className='backgroundModal' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div className='modalWindow' ref={modalRef}>
                <p className='logTitle'>Login with username</p>
                <input
                    type='text'
                    className='loginInput'
                    placeholder='Enter username...'
                    value={username}
                    minLength='3'
                    maxLength='35'
                    onChange={(event) => handleChange(event.target.value)}
                    onKeyDown={(event) => handleEnter(event)}
                />
                <label className={`custom-checkbox ${checked ? 'checked' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={handleCheckboxChange} style={{display: 'none'}}/>
                </label>
                <p className='agreement'> I agree with
                    <span
                        className='tosLabelLogin'
                        onClick={() => handleNavigate('/tos')}> terms of use
                    </span>
                </p>
                {verStatus &&
                    <span className='verStatus'>{verStatus}</span>
                }
                {verify ?
                    <>
                        <div className='verifyContainer'>
                            {verifyBio}
                        </div>
                        <span className='explainingText'>
                            Put that info in the description of your Roblox account, then click the verify button
                            after saving it on Roblox.com.
                        </span>
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