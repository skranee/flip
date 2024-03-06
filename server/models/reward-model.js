import {Schema, model} from 'mongoose';

const RewardSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String, default: 'https://media.discordapp.net/attachments/1210295580807667802/1214643955015360582/currImg.png?ex=65f9dc55&is=65e76755&hm=9537b64b3b9306dab5296ed72ed0f3d9971ea35bbc7b9ee5ad655a278313a7fc&=&format=webp&quality=lossless&width=617&height=617'},
    lvl: {type: Number, required: true},
    gemsAmount: {type: Number, required: true}
})

export default model('Reward', RewardSchema);