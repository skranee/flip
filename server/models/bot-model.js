import {Schema, model} from 'mongoose';

const BotSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    rarity: {type: String, required: true},
    image: {type: String},
    price: {type: Number},
    itemId: {type: String, required: true, unique: true},
    holder: {type: String},
    gameName: {type: String, required: true}
})

export default model('BotItem', BotSchema);