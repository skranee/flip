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
        name: 'ewScythe',
        cost: 123
    },
    {
        image: hallowScythe,
        name: 'Hallow Scythe',
        cost: 4234
    },
    {
        image: harvester,
        name: 'harvester',
        cost: 312
    },
    {
        image: iceBreaker,
        name: 'Ice Breaker',
        cost: 523
    },
    {
        image: icePiercer,
        name: 'Ice Piercer',
        cost: 1313
    },
    {
        image: swirlyAxe,
        name: 'Swirly Axe',
        cost: 444
    },
    {
        image: travellersAxe,
        name: 'Travellers Axe',
        cost: 3213
    },
]

class Player {
    avatar;
    name;
    bet;
    items;
    worth;

    constructor(obj) {
        this.avatar = obj.avatar;
        this.name = obj.name;
        this.items = obj.items;
        this.bet = this.calcBet()
        this.worth = obj.worth;
    }

    calcBet() {
        return this.items.reduce((a, b) => a + b.cost, 0)
    }
}

export const players = [
    new Player({
        avatar: av1,
        name: 'skranee',
        items: [items[1], items[0], items[3]],
        worth: 321
    }),
    new Player({
        avatar: av2,
        name: 'player2',
        items: [items[2], items[4], items[5]],
        worth: 221
    }),
    new Player({
        avatar: av3,
        name: 'player3',
        items: items,
        worth: 4444
    }),
    new Player({
        avatar: av4,
        name: 'player4',
        items: [items[1], items[0], items[3]],
        worth: 234
    }),
    new Player({
        avatar: av4,
        name: 'player5',
        items: [items[1], items[0], items[3]],
        worth: 11
    }),
    new Player({
        avatar: av3,
        name: 'player6',
        items: [items[1], items[0], items[3]],
        worth: 332
    }),
    new Player({
        avatar: av2,
        name: 'player7',
        items: [items[1], items[0], items[3]],
        worth: 4541
    }),
    new Player({
        avatar: av1,
        name: 'player8',
        items: [items[1], items[0], items[3]],
        worth: 4
    })
]