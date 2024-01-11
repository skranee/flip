import {Schema, model} from 'mongoose';

const GameSchema = new Schema({
    player1: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    player2: {type: Schema.Types.ObjectId, ref: 'User'},
    gameId: {type: String, required: true},
    items1: {type: Array, required: true},
    items2: {type: Array},
    result: {type: String},
    side1: {type: String, default: 'black'},
    side2: {type: String},
    status: {type: String, default: 'Joinable'}
})

export default model('Game', GameSchema);