import affiliateModel from "../models/affiliate-model.js";

class affiliateService {
    async createAffiliate(ref, userId) {
        const candidate = await affiliateModel.findOne({user: userId});
        if(!candidate) {
            const create = await affiliateModel.create({affiliateCode: ref, affiliateLink: `${process.env.CLIENT_URL}/a/${ref}`, user: userId});
            return create;
        }
        const update = await affiliateModel.findOneAndUpdate({user: userId}, {affiliateCode: ref, affiliateLink: `${process.env.CLIENT_URL}/a/${ref}`});
        return update;
    }

    async getAffiliate(userId) {
        const find = await affiliateModel.findOne({user: userId});
        return find;
    }
}

export default new affiliateService();