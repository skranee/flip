import {Schema, model} from 'mongoose';

const MessageSchema = new Schema({
    message: {type: String, required: true},
    id: {type: String, required: true, unique: true},
    removal: {type: Number, default: 1},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    time: {type: String, required: true},
    avatar: {type: String, required: true}
})

export default model('Message', MessageSchema);