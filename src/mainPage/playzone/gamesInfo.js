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
        price: 123,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: hallowScythe,
        name: 'Hallow Scythe',
        price: 4234,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: harvester,
        name: 'harvester',
        price: 312,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: iceBreaker,
        name: 'Ice Breaker',
        price: 523,
        classification: 'Gun',
        rarity: 'mythical'
    },
    {
        image: icePiercer,
        name: 'Ice Piercer',
        price: 1313,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: swirlyAxe,
        name: 'Swirly Axe',
        price: 444,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: travellersAxe,
        name: 'Travellers Axe',
        price: 3213,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: ewScythe,
        name: 'ewScythe',
        price: 123,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: hallowScythe,
        name: 'Hallow Scythe',
        price: 4234,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: harvester,
        name: 'harvester',
        price: 312,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: iceBreaker,
        name: 'Ice Breaker',
        price: 523,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: icePiercer,
        name: 'Ice Piercer',
        price: 1313,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: swirlyAxe,
        name: 'Swirly Axe',
        price: 444,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: travellersAxe,
        name: 'Travellers Axe',
        price: 3213,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: ewScythe,
        name: 'ewScythe',
        price: 123,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: hallowScythe,
        name: 'Hallow Scythe',
        price: 4234,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: harvester,
        name: 'harvester',
        price: 312,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: iceBreaker,
        name: 'Ice Breaker',
        price: 523,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: icePiercer,
        name: 'Ice Piercer',
        price: 1313,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: swirlyAxe,
        name: 'Swirly Axe',
        price: 444,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: travellersAxe,
        name: 'Travellers Axe',
        price: 3213,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: ewScythe,
        name: 'ewScythe',
        price: 123,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: hallowScythe,
        name: 'Hallow Scythe',
        price: 4234,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: harvester,
        name: 'harvester',
        price: 312,
        classification: 'Blade',
        rarity: 'legendary'
    },
    {
        image: iceBreaker,
        name: 'Ice Breaker',
        price: 523,
        classification: 'Gun',
        rarity: 'legendary'
    },
    {
        image: icePiercer,
        name: 'Ice Piercer',
        price: 1313,
        classification: 'Blade',
        rarity: 'mythical'
    },
    {
        image: swirlyAxe,
        name: 'Swirly Axe',
        price: 444,
        classification: 'Gun',
        rarity: 'mythical'
    },
    {
        image: travellersAxe,
        name: 'Travellers Axe',
        price: 3213,
        classification: 'Blade',
        rarity: 'legendary'
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
        return this.items.reduce((a, b) => a + b.price, 0)
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