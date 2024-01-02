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
import WeeklyRace from "./leadersBoard/leadersBoard";
import Support from "./support/support";
import Answer from "./support/answer";

function App() {
    const {globalStore, store} = useContext(Context);

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
        <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/market' element={<Market />} />
            <Route path='/rewards' element={<Rewards />} />
            <Route path='/leaders' element={<WeeklyRace />} />
            <Route path='/support' element={<Support />} />
            <Route path='/answer' element={<Answer />} />
        </Routes>
        <LeftPanel />
        <Chat />
        <FaqBeneath />
    </>
  );
}

export default App;
