import {Schema, model} from 'mongoose';

const HistorySchema = new Schema({
    date: {type: String, required: true},
    result: {type: String, required: true},
    player1: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    player2: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    totalWorth: {type: Number, required: true},
    timestamp: {type: Date, default: Date.now()}
})

export default model('History', HistorySchema);