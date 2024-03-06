import {Schema, model} from 'mongoose';

const WithdrawSchema = new Schema({
    userId: {type: String, unique: true, required: true},
    items: {type: Array, required: true},
    fullItems: {type: Array, required: true},
    botName: {type: String, required: true}
})

export default new model('Withdraw', WithdrawSchema);