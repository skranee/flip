import React, {useContext} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";

function ProvablyFair() {
    const {store, globalStore} = useContext(Context);

    const containerWidth = () => {
        if(!globalStore.chatOpened && globalStore.panelOpen) {
            return '84.5%'
        }
        else if(!globalStore.chatOpened && !globalStore.panelOpen) {
            return '97.5%'
        }
        else if(globalStore.chatOpened && !globalStore.panelOpen) {
            return '81%'
        }
        else {
            return '68%'
        }
    }

    return (
        <div>
            <div className='background' />
            <div className='mainPage'>
                <div className='tosContainer' style={{
                    width: containerWidth(),
                    marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
                }}>
                    <div>
                        <h1>Provably Fair</h1>
                        <div>
                            <span>
                                <b>Last updated March 5, 2024</b>
                            </span>
                        </div>

                        <h2 style={{fontSize: '1.8em'}}>How It Works</h2>
                        <p style={{fontSize: '1.5em'}}>
                            Every game must be fair and you as a user of the website must have a way to find out
                            if your game was rigged. We use third-party services to find out a winner of each game, it's generated
                            randomly and can be checked after each game by participants of the coinflip. After the coinflip is
                            finished and winner is found out, each of the participants of the coinflip is able to click the button
                            that shows up and check everything about the game: the possibility of winning, exact numbers, randomly
                            generated number. After you are on the third-party page look at dates, ticket numbers and everything
                            you may find necessary to be sure the game was fair. After that you are able to see full results by
                            clicking the corresponding button. Then you'll be able to see how the provably fair works and
                            check everything one more time.
                        </p>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default observer(ProvablyFair);