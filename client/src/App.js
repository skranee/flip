import React, {useContext, useEffect} from 'react'
import MainPage from "./mainPage/mainPage.jsx";
import LeftPanel from "./mainPage/leftPanel/leftPanel";
import FaqBeneath from "./faqBeneath";
import Chat from "./chat/chat";
import {Context} from "./index";
import NavigationPanel from "./mainPage/navigation/navigation";
import {Route, Routes, useNavigate} from "react-router-dom";
import Profile from "./profile/profile";
import Market from "./market/market";
import Rewards from "./rewards/rewards";
import Support from "./support/support";
import Answer from "./support/answer";
import AdminPanel from "./adminPanel/adminPanel";
import LeadersBoard from "./leadersBoard/leadersBoard";
import TOS from "./tos/tos";
import PrivacyPolicy from "./privacyPolicy/privacyPolicy";
import ProvablyFair from "./provablyFair/provablyFair";
import {observer} from "mobx-react";
import ErrorWindow from "./errorWindow/errorWindow";

export function notify() {
    try {
        const notificationSound = document.getElementById('notificationSound');

        if (notificationSound && 'play' in notificationSound) {
            notificationSound.play();
        }
    } catch(error) {
        console.error('Failed to play notification sound:', error);
    }
}

function App() {
    const {globalStore, store} = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if(
            window.location.pathname !== '/' &&
            window.location.pathname !== '/profile' &&
            window.location.pathname !== '/market' &&
            window.location.pathname !== '/rewards' &&
            window.location.pathname !== '/leaders' &&
            window.location.pathname !== '/support' &&
            window.location.pathname !== '/answer' &&
            window.location.pathname !== '/admin' &&
            window.location.pathname !== '/tos' &&
            window.location.pathname !== '/privacy-policy' &&
            window.location.pathname !== '/provably-fair'
        )
        {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        // function getCookie(name) {
        //     const nameLenPlus = (name.length + 1);
        //     return document.cookie
        //         .split(';')
        //         .map(c => c.trim())
        //         .filter(cookie => {
        //             return cookie.substring(0, nameLenPlus) === `${name}=`;
        //         })
        //         .map(cookie => {
        //             return decodeURIComponent(cookie.substring(nameLenPlus));
        //         })[0] || null;
        // }
        if(localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, [store]);

    useEffect(() => {
        if(store.isAuth) {
            const av = async () => {
                const avatar = await store.getAvatar(store.user.robloxId);
                store.setAvatar(avatar);
                localStorage.setItem('avatarUrl', avatar);
            }
            av();
        }
    }, [store]);

    return (
    <div className='main'>
        <NavigationPanel />
        <div className='background' />
        {globalStore.errorWindow &&
            <ErrorWindow />
        }
        {(!store.user || !store.user.banned) &&
            <>
                <Routes>
                    <Route path='/' element={<MainPage />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/market' element={<Market />} />
                    <Route path='/rewards' element={<Rewards />} />
                    <Route path='/leaders' element={<LeadersBoard />} />
                    <Route path='/support' element={<Support />} />
                    <Route path='/answer' element={<Answer />} />
                    {store.user.role === 'admin' &&
                        <Route path='/admin' element={<AdminPanel />} />
                    }
                    <Route path='/tos' element={<TOS />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/provably-fair' element={<ProvablyFair />} />
                </Routes>
                <LeftPanel />
                <Chat />
                <FaqBeneath />
            </>
        }
        {(store.user && store.user.banned) &&
            <div className='banPage'>
                <span className='bannedMessage'>
                    You are banned on the website. To get any information about your ban, please contact our support.
                </span>
            </div>
        }
    </div>
    );
}

export default observer(App);
