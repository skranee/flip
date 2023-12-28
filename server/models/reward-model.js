import {Schema, model} from 'mongoose';

const RewardSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    lvl: {type: Number, required: true},
    description: {type: String, default: 'Bonus'}
})

export default model('Reward', RewardSchema);