import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";

function LoginModal () {
    const {globalStore} = useContext(Context)
    const [username, setUsername] = useState('')
    const [showTerms, setShowTerms] = useState(false) //do later
    const [checked, setChecked] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(() => {
        if(!checked || !username || !username.trim()) {
            setIsDisabled(true)
        }
        else {
            setIsDisabled(false)
        }
    }, [checked, username]);

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

    const handleLogin = () => {
        console.log('login')
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
                <button className='btnLogin' disabled={isDisabled} onClick={() => handleLogin()}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default LoginModal;