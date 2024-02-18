import {Schema, model} from 'mongoose';

const LinkedCodeSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    linkedCode: {type: String, required: true},
    usages: {type: Number, default: 0}
})

export default model('LinkedCode', LinkedCodeSchema);