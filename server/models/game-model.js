import {Schema, model} from 'mongoose';

const GameSchema = new Schema({
    player1: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    player2: {type: Schema.Types.ObjectId, ref: 'User'},
    gameId: {type: String, required: true},
    gems1: {type: Number},
    gems2: {type: Number},
    items1: {type: Array},
    items2: {type: Array},
    result: {type: String},
    side1: {type: String, default: 'red'},
    side2: {type: String},
    status: {type: String, default: 'Joinable'},
    checkLink: {type: String}
})

export default model('Game', GameSchema);