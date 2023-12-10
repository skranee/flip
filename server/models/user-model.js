import {Schema, model} from 'mongoose'
import TokenModel from "./token-model.js";

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
})

export default model('User', UserSchema);