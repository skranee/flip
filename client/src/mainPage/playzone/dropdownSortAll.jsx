import React, {useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react";

function DropdownSortAll({params}) {
    const {globalStore} = useContext(Context)
    const handleTitle = (title) => {
        globalStore.setTitleAll(title)
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

export default observer(DropdownSortAll);