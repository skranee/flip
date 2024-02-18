import affiliateModel from "../models/affiliate-model.js";
import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";

class affiliateService {
    async createAffiliate(ref, userId) {
        const checkAvailable = await affiliateModel.findOne({affiliateCode: ref});
        if(checkAvailable) {
            return ApiError.BadRequest('This code is not available');
        }
        const candidate = await affiliateModel.findOne({user: userId});
        if(!candidate) {
            const create = await affiliateModel.create({affiliateCode: ref, affiliateLink: `${process.env.CLIENT_URL}/a/${ref}`, user: userId});
            return create;
        }
        const update = await affiliateModel.findOneAndUpdate({user: userId}, {affiliateCode: ref, affiliateLink: `${process.env.CLIENT_URL}/a/${ref}`});
        return update;
    }

    async getBalance(userId) {
        const affiliate = await affiliateModel.findOne({user: userId});
        const add = await userModel.updateOne({_id: userId}, {$inc: {balance: affiliate.affiliatedBalance}});
        const decrease = await affiliateModel.updateOne({user: userId}, {$inc: {affiliatedBalance: -affiliate.affiliatedBalance}});
        return add;
    }

    async getAffiliate(userId) {
        const find = await affiliateModel.findOne({user: userId});
        return find;
    }

    async checkForCode(code) {
        const response = await affiliateModel.findOne({affiliateCode: code});
        if(response && response.affiliateCode === code) {
            return code;
        } else {
            throw ApiError.BadRequest('This code was not found');
        }
    }

    async linkCode(code) {
        const link = await affiliateModel.updateOne({affiliateCode: code}, {$inc: {affiliatedUsers: 1}});
        return link;
    }

    async codeUse(code, payment) {
        const balance = payment * 0.01;
        const update = await affiliateModel.updateOne({affiliateCode: code}, {$inc: {affiliatedBalance: balance}});
        return update;
    }

    async unlinkCode(code) {
        const unlink = await affiliateModel.updateOne({affiliateCode: code}, {$inc: {affiliatedUsers: -1}});
        return unlink;
    }
}

export default new affiliateService();