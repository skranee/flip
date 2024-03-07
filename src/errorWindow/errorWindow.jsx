import React, {useContext} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";

function ErrorWindow() {
    const {globalStore, store} = useContext(Context);

    const handleBlur = () => {
        globalStore.setErrorWindow(false);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='errorWindow' onClick={(event) => event.stopPropagation()}>
                <a>{globalStore.errorMessage}</a>
            </div>
        </div>
    )
}

export default observer(ErrorWindow);