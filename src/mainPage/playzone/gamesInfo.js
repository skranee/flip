import av1 from '../../imgs/av1.png';
import av2 from '../../imgs/av2.png';
import av3 from '../../imgs/av3.png';
import av4 from '../../imgs/av4.png';
import ewScythe from '../../imgs/ewscythe.png';
import hallowScythe from '../../imgs/hallowscythe.png';
import harvester from '../../imgs/harvester.png';
import iceBreaker from '../../imgs/icebreaker.png';
import icePiercer from '../../imgs/Icepiercer.png';
import swirlyAxe from '../../imgs/swirlyaxe.png';
import travellersAxe from '../../imgs/TravellersAxe.png';


export const items = [ //should add some fields to items such as rarity, float, etc...
    {
        image: ewScythe,
        name: 'ewScythe'
    },
    {
        image: hallowScythe,
        name: 'Hallow Scythe'
    },
    {
        image: harvester,
        name: 'harvester'
    },
    {
        image: iceBreaker,
        name: 'Ice Breaker'
    },
    {
        image: icePiercer,
        name: 'Ice Piercer'
    },
    {
        image: swirlyAxe,
        name: 'Swirly Axe'
    },
    {
        image: travellersAxe,
        name: 'Travellers Axe'
    },
]

class player {
    avatar
    name
    bet
    items
    worth

    constructor(obj) {
        this.avatar = obj.avatar;
        this.name = obj.name;
        this.bet = obj.bet;
        this.items = obj.items;
        this.worth = obj.worth;
    }
}

export const players = [
    {
        avatar: av1,
        name: 'skranee',
        bet: 432,
        items: [items[1], items[0], items[3]],
        worth: 321
    },
    {
        avatar: av2,
        name: 'player2',
        bet: 412,
        items: [items[2], items[4], items[5]],
        worth: 221
    },
    {
        avatar: av3,
        name: 'player3',
        bet: 232,
        items: items,
        worth: 4444
    },
    {
        avatar: av4,
        name: 'player4',
        bet: 253,
        items: [items[1], items[0], items[3]],
        worth: 234
    },
    {
        avatar: av4,
        name: 'player5',
        bet: 111,
        items: [items[1], items[0], items[3]],
        worth: 11
    },
    {
        avatar: av3,
        name: 'player6',
        bet: 421,
        items: [items[1], items[0], items[3]],
        worth: 332
    },
    {
        avatar: av2,
        name: 'player7',
        bet: 142,
        items: [items[1], items[0], items[3]],
        worth: 4541
    },
    {
        avatar: av1,
        name: 'player8',
        bet: 144,
        items: [items[1], items[0], items[3]],
        worth: 4
    }
]