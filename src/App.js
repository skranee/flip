import React, {useContext, useEffect} from 'react'
import MainPage from "./mainPage/mainPage";
import LeftPanel from "./mainPage/leftPanel/leftPanel";
import FaqBeneath from "./faqBeneath";
import Chat from "./chat/chat";
import {Context} from "./index";
import LoginModal from "./mainPage/loginModal/loginModal";
import {observer} from "mobx-react";
import NavigationPanel from "./mainPage/navigation/navigation";

function App() {
    const {globalStore, store} = useContext(Context);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    if(store.isLoading) {
        return (
            <div className='loaderBackground'>
                <div className='loader'></div>
            </div>
        )
    }

    return (
    <>
        <NavigationPanel />
        <MainPage />
        {globalStore.logOpen ? <LoginModal /> : <div />}
        <LeftPanel />
        <FaqBeneath />
        <Chat />
    </>
  );
}

export default observer(App);
