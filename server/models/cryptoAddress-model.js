import {Schema, model} from 'mongoose';

const AddressSchema = new Schema({
    address: {type: String, unique: true, required: true},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    currency: {type: String, required: true}
})

export default new model('Address', AddressSchema);