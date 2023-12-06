import React, {useContext} from 'react'
import MainPage from "./mainPage/mainPage";
import LeftPanel from "./mainPage/leftPanel/leftPanel";
import FaqBeneath from "./faqBeneath";
import Chat from "./chat/chat";
import {Context} from "./index";
import LoginModal from "./mainPage/loginModal/loginModal";
import {observer} from "mobx-react";
import NavigationPanel from "./mainPage/navigation/navigation";

function App() {
    const {globalStore} = useContext(Context)

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
