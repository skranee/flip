import affiliateModel from "../models/affiliate-model.js";
import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";
import tokenService from "./token-service.js";

class affiliateService {
    async createAffiliate(ref, refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if(!token) {
            return ApiError.UnauthorizedError();
        }
        const userId = token.user;
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

    async getBalance(token) {
        const tokenData = await tokenService.findToken(token);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
        const user = await userModel.findOne({_id: userId});
        if(!user) {
            return ApiError.BadRequest('Unexpected error');
        }
        if(user.balance < 150) {
            return ApiError.BadRequest('Your balance must be more than 150 gems');
        }
        const affiliate = await affiliateModel.findOne({user: userId});
        const add = await userModel.updateOne({_id: userId}, {$inc: {balance: affiliate.affiliatedBalance}});
        const decrease = await affiliateModel.updateOne({user: userId}, {$inc: {affiliatedBalance: -affiliate.affiliatedBalance}});
        return add;
    }

    async getAffiliate(token) {
        const tokenData = await tokenService.findToken(token);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
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