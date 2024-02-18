import {Schema, model} from 'mongoose';

const TransactionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
    address: {type: String, required: true},
    usdAmount: {type: Number, required: true},
    paymentCurrency: {type: String, required: true},
    receivedBalance: {type: Number, required: true}
})

export default new model('Transaction', TransactionSchema);