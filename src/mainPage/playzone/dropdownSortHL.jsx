import React, {useContext} from 'react';
import {observer} from "mobx-react";
import {Context} from "../../index";

function DropdownSortHL({params}) {
    const {globalStore} = useContext(Context)
    const handleTitle = (title) => {
        globalStore.setTitleHL(title)
    }

    return (
        <div className='dropdownSort'>
            <ul className='sortSpace'>
                {params.map((item, index) => (
                    <li key={index} className='paramSort' onClick={() => handleTitle(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default observer(DropdownSortHL);