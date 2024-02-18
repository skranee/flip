import {Schema, model} from 'mongoose';

const MarketSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, required: true},
    rarity: {type: String, required: true},
    classification: {type: String, required: true},
    image: {type: String}, //mb need base64
    price: {type: Number},
    itemId: {type: String, required: true, unique: true}
})

export default model('MarketItem', MarketSchema);