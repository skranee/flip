import {Schema, model} from 'mongoose';

const SupportSchema = new Schema({
    message: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    answered: {type: Boolean, default: false},
    answer: {type: String, default: ''}
})

export default new model('Support', SupportSchema);