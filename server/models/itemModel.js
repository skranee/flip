import {Schema, model} from 'mongoose';

const ItemSchema = new Schema({
    name: {type: String, required: true},
    value: {type: Number}
})

export default new model('ItemData', ItemSchema);