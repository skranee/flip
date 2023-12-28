import {Schema, model} from 'mongoose'

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    avatar: {type: String, required: true},
    regDate: {type: String},
    robloxId: {type: String, required: true, unique: true},
    totalDeposited: {type: Number, default: 0},
    totalWithdrawn: {type: Number, default: 0},
    totalWagered: {type: Number, default: 0},
    gamesPlayed: {type: Number, default: 0},
    itemsList: {type: Array, default: []},
    balance: {type: Number, default: 0},
    role: {type: String, default: 'user'},
    lvl: {type: Number, default: 1},
    experience: {type: Number, default: 0},
    gotReward: {type: Boolean, default: true},
})

export default model('User', UserSchema);