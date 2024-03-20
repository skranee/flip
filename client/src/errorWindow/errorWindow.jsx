import React, {useContext} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";

function ErrorWindow() {
    const {globalStore} = useContext(Context);

    const handleBlur = () => {
        globalStore.setErrorWindow(false);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div className='errorWindow' onClick={(event) => event.stopPropagation()}>
                <span>{globalStore.errorMessage}</span>
            </div>
        </div>
    )
}

export default observer(ErrorWindow);