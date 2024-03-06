import React, {useContext, useEffect} from "react";
import logo from "./mainPage/navigation/logo.png";
import inst from './imgs/inst.png'
import kick from './imgs/kick.png'
import tiktok from './imgs/tiktok.png'
import twitch from './imgs/twitch.png'
import x from './imgs/x.png'
import discord from './imgs/discord.png'
import youtube from './imgs/youtube.png'
import ban from './imgs/ban.png'
import {useNavigate} from "react-router-dom";
import {Context} from "./index";
import {observer} from "mobx-react";

function FaqBeneath () {
    const {globalStore} = useContext(Context);
    const underLogo = 'MM2Flip is a brand name';
    const gmailSupport = 'support@mm2flip.com';
    const navigate = useNavigate();

    const handleNavigate = (social) => {
        window.open(social)
    }

    const handleNavigateModals = (page) => {
        navigate(page);
    }

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
        <div className='faq' style={{
            width: containerWidth(),
            marginLeft: globalStore.panelOpen ? '14.5%' : '1%'
        }}>
            <div className='logoContainer'>
                <img className='logoFaq' src={logo} alt=''/>
                <a className='underLogoText'>{underLogo}</a>
                <a className='underLogoText'>of THE SOLUTIONIST LLC</a>
                <a className='gmailFaq'>{gmailSupport}</a>
            </div>
            <div className='optionsFaq'>
                <a>Rewards</a>
                <a className='underOptions' onClick={() => handleNavigateModals('/rewards')}>Level Rewards</a>
                <a className='underOptions' onClick={() => handleNavigateModals('/leaders')}>Leaderboard</a>
            </div>
            <div className='optionsFaq'>
                <a>Games</a>
                <a className='underOptions' onClick={() => handleNavigateModals('/')}>Coin Flip</a>
            </div>
            <div className='optionsFaq'>
                <a>Other</a>
                <a className='underOptions' onClick={() => handleNavigateModals('/tos')}>Terms Of<br />Service</a>
                {/*<a className='underOptions'>Refund Policy</a>*/}
                <a className='underOptions' onClick={() => handleNavigateModals('/provably-fair')}>Provably Fair</a>
                <a className='underOptions' onClick={() => handleNavigateModals('/privacy-policy')}>Privacy Policy</a>
            </div>
            <div  className='optionsFaq'>
                <a>Socials</a>
                <div className='socialsFaq'>
                    <img
                        className='socialsLogo'
                        src={inst}
                        alt=''
                        onClick={() => handleNavigate('https://www.instagram.com/mm2flip/')}
                    />
                    <img
                        className='socialsLogo'
                        src={kick}
                        alt=''
                        onClick={() => handleNavigate('https://kick.com/mm2flip')}
                    />
                    <img
                        className='socialsLogo'
                        src={x}
                        alt=''
                        onClick={() => handleNavigate('https://twitter.com/mm2flipofficial')}
                    />
                    <img
                        className='socialsLogo'
                        src={twitch}
                        alt=''
                        onClick={() => handleNavigate('https://www.twitch.tv/mm2flip')}
                    />
                    <img
                        className='socialsLogo'
                        src={tiktok}
                        alt=''
                        onClick={() => handleNavigate('https://www.tiktok.com/@mm2flip')}
                    />
                    <img
                        className='socialsLogo'
                        src={discord}
                        alt=''
                        onClick={() => handleNavigate('https://discord.gg/mm2flip')}
                    />
                    <img
                        className='socialsLogo'
                        src={youtube}
                        alt=''
                        onClick={() => handleNavigate('https://www.youtube.com/@mm2flip')}
                    />
                </div>
            </div>
            <div className='banContainer'>
                <img src={ban} alt=''/>
                <div className='banRight'>
                    <a className='banTextFaq'>18+ Only</a>
                    <a className='banTextFaq_2'>Game responsibly</a>
                </div>
                <a className='copyrightFaq'>© Copyright 2023 mm2flip</a>
            </div>
        </div>
    )
}

export default observer(FaqBeneath);