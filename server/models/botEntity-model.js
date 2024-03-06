import {Schema, model} from 'mongoose';

const BotEntitySchema = new Schema({
    robloxId: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    avatar: {type: String, required: true},
    status: {type: String, default: 'online'},
    serverUrl: {type: String, required: true}
})

export default model('BotEntity', BotEntitySchema);