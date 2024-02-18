import {Schema, model} from 'mongoose';

const WithdrawSchema = new Schema({
    userId: {type: String, required: true, unique: true},
    items: {type: Array, required: true}
})

export default new model('Withdraw', WithdrawSchema);