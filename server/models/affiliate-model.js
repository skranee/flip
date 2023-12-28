import {Schema, model} from "mongoose";
import {config} from "dotenv";

config();

const AffiliateSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    affiliatedUsers: {type: Number, default: 0},
    affiliatedBalance: {type: Number, default: 0},
    affiliateCode: {type: String, default: 'code', required: true},
    affiliateLink: {type: String, default: `${process.env.CLIENT_URL}/a/code`, required: true}
})

export default model('Affiliate', AffiliateSchema);