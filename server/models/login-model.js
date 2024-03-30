import {Schema, model} from 'mongoose';

const LoginSchema = new Schema({
    username: {type: String, required: true, unique: true},
    description: {type: String, required: true, unique: true},
    userId: {type: String, required: true, unique: true}
})

export default model('Login', LoginSchema);