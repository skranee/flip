import React from "react";
import logo from "./mainPage/navigation/logo.png";
import inst from './imgs/inst.png'
import kick from './imgs/kick.png'
import tiktok from './imgs/tiktok.png'
import twitch from './imgs/twitch.png'
import x from './imgs/x.png'
import discord from './imgs/discord.png'
import ban from './imgs/ban.png'

function FaqBeneath () {
    const underLogo = 'MM2Flip is a brand name of...'
    const gmailSupport = 'support@mm2flip.com'

    const handleNavigate = (social) => {
        window.open(social)
    }

    return (
        <div className='faq'>
            <img className='logoFaq' src={logo} alt=''/>
            <a className='underLogoText'>{underLogo}</a>
            <a className='gmailFaq'>{gmailSupport}</a>
            <div className='optionsFaq'>
                <a>Rewards</a>
                <a className='underOptions' style={{marginTop: 55}}>Level Rewards</a>
                <a className='underOptions'>Leaderboard</a>
            </div>
            <div className='optionsFaq' style={{marginLeft: '8%'}}>
                <a>Games</a>
                <a className='underOptions'>Coin Flip</a>
            </div>
            <div className='optionsFaq' style={{marginLeft: '16%'}}>
                <a>Other</a>
                <a className='underOptions'>Terms Of<br />Service</a>
                <a className='underOptions' style={{marginTop: 65}}>Refund Policy</a>
                <a className='underOptions' style={{marginTop: 95}}>Provably Fair</a>
            </div>
            <div  className='optionsFaq' style={{marginLeft: '24%'}}>
                <a>Socials</a>
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
                    style={{marginLeft: 25}}
                    onClick={() => handleNavigate('https://kick.com/mm2flip')}
                />
                <img
                    className='socialsLogo'
                    src={x}
                    alt=''
                    style={{marginLeft: 50}}
                    onClick={() => handleNavigate('https://twitter.com/mm2_flip')}
                />
                <img
                    className='socialsLogo'
                    src={twitch}
                    alt=''
                    style={{marginLeft: 75}}
                    onClick={() => handleNavigate('https://www.twitch.tv/mm2flip')}
                />
                <img
                    className='socialsLogo'
                    src={tiktok}
                    alt=''
                    style={{marginLeft: 100}}
                    onClick={() => handleNavigate('https://www.tiktok.com/@mm2flip')}
                />
                <img
                    className='socialsLogo'
                    src={discord}
                    alt=''
                    style={{marginLeft: 125}}
                    onClick={() => handleNavigate('https://discord.gg/mm2flip')}
                />
            </div>
            <img className='banFaq' src={ban} alt=''/>
            <a className='banTextFaq'>18+ Only</a>
            <a className='banTextFaq_2'>Game responsibly</a>
            <a className='copyrightFaq'>© Copyright 2023 mm2flip</a>
        </div>
    )
}

export default FaqBeneath;