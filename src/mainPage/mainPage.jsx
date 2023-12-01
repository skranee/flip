import React, {useContext} from "react";
import NavigationPanel from "./navigation/navigation";
import {Context} from "../index";
import LoginModal from "./loginModal/loginModal";
import {observer} from "mobx-react";
import LeftPanel from "./leftPanel/leftPanel";
import Playzone from "./playzone/playzone";

function MainPage() {
    const {globalStore} = useContext(Context)

    return (
        <div>
            <NavigationPanel />
            {globalStore.logOpen ? <LoginModal /> : <div />}
            <div className='mainPage'>
                <Playzone />
            </div>
        </div>
    )
}

export default observer(MainPage);