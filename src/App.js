import React, {useContext, useEffect} from 'react'
import MainPage from "./mainPage/mainPage";
import LeftPanel from "./mainPage/leftPanel/leftPanel";
import FaqBeneath from "./faqBeneath";
import Chat from "./chat/chat";
import {Context} from "./index";
import NavigationPanel from "./mainPage/navigation/navigation";
import {Route, Routes} from "react-router-dom";
import Profile from "./profile/profile";
import Market from "./market/market";
import Rewards from "./rewards/rewards";
import Support from "./support/support";
import Answer from "./support/answer";
import AdminPanel from "./adminPanel/adminPanel";
import LeadersBoard from "./leadersBoard/leadersBoard";
import TOS from "./tos/tos";
import PrivacyPolicy from "./privacyPolicy/privacyPolicy";

function App() {
    const {globalStore, store} = useContext(Context);
    console.log(store.user.avatar)

    useEffect(() => {
        if(localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    useEffect(() => {
        if(store.isAuth) {
            const av = async () => {
                const avatar = await store.getAvatar(store.user.robloxId);
                store.setAvatar(avatar);
                localStorage.setItem('avatarUrl', avatar);
            }
            av();
        }
    }, []);

    return (
        //<Redirect /> !!!
        //handle 404 (don't show elements like chat, faq etc when the page is .../rekfdosf) => 404 page
    <>
        <NavigationPanel />
        <div className='background' />
        <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/market' element={<Market />} />
            <Route path='/rewards' element={<Rewards />} />
            <Route path='/leaders' element={<LeadersBoard />} />
            <Route path='/support' element={<Support />} />
            <Route path='/answer' element={<Answer />} />
            <Route path='/admin' element={<AdminPanel />} />
            <Route path='/tos' element={<TOS />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        </Routes>
        <LeftPanel />
        <Chat />
        <FaqBeneath />
    </>
  );
}

export default App;
