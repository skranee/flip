import linkedCodeModel from "../models/linkedCode-model.js";
import affiliateModel from "../models/affiliate-model.js";
import ApiError from "../exceptions/api-error.js";

class LinkedCodeService {
    async getLinkedCode(userId) {
        const code = await linkedCodeModel.findOne({user: userId});
        return code;
    }

    async linkLinkedCode(code, userId) {
        const candidate = await linkedCodeModel.findOne({user: userId});
        if(candidate) {
            if(candidate.linkedCode === code) {
                return candidate;
            } else {
                const checkForCode = await affiliateModel.findOne({affiliateCode: code});
                if(checkForCode) {
                    const decrease = await affiliateModel.updateOne({affiliateCode: candidate.linkedCode}, {$inc: {affiliatedUsers: -1}});
                    const increase = await affiliateModel.updateOne({affiliateCode: code}, {$inc: {affiliatedUsers: 1}});
                    const update = await linkedCodeModel.findOneAndUpdate({user: userId}, {linkedCode: code});
                    return update;
                } else {
                    return ApiError.BadRequest('Not existing code');
                }
            }
        } else {
            const checkForCode = await affiliateModel.findOne({affiliateCode: code});
            if(checkForCode) {
                const create = await linkedCodeModel.create({user: userId, linkedCode: code});
                const increase = await affiliateModel.updateOne({affiliateCode: code}, {$inc: {affiliatedUsers: 1}});
                return create;
            } else {
                return ApiError.BadRequest('Not existing code');
            }
        }
    }
}

export default new LinkedCodeService();