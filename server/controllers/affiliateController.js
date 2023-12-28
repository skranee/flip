import affiliateService from "../services/affiliateService.js";

class affiliateController {
    async createAffiliate(req, res, next) {
        try {
            const {code, userId} = req.body;
            const create = await affiliateService.createAffiliate(code, userId);
            return res.json(create.data);
        } catch(e) {
            next(e);
        }
    }

    async getAffiliate(req, res, next) {
        try {
            const userId = req.query.userId;
            const system = await affiliateService.getAffiliate(userId);
            return res.json(system);
        } catch(e) {
            next(e);
        }
    }
}

export default new affiliateController();