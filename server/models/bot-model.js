import {Schema, model} from 'mongoose';

const BotSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    rarity: {type: String, required: true},
    classification: {type: String, required: true},
    image: {type: String}, //mb need base64
    price: {type: Number},
    itemId: {type: String, required: true, unique: true}
})

export default model('BotItem', BotSchema);