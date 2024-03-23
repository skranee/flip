import affiliateService from "../services/affiliateService.js";

class affiliateController {
    async createAffiliate(req, res, next) {
        try {
            const {key, code, userId} = req.body;
            const create = await affiliateService.createAffiliate(key, code, userId);
            return res.json(create);
        } catch(e) {
            next(e);
        }
    }

    async getBalance(req, res, next) {
        try {
            const {userId} = req.body;
            const add = await affiliateService.getBalance(userId);
            return res.json(add);
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

    async checkForCode(req, res, next) {
        try {
            const code = req.query.code;
            const check = await affiliateService.checkForCode(code);
            return res.json(check);
        } catch(e) {
            next(e);
        }
    }

    async linkCode(req, res, next) {
        try {
            const {key, code} = req.body;
            const link = await affiliateService.linkCode(key, code);
            return res.json(link);
        } catch(e) {
            next(e);
        }
    }

    async codeUse(req, res, next) {
        try {
            const {code, payment} = req.body;
            const use = await affiliateService.codeUse(code, payment);
            return res.json(use);
        } catch(e) {
            next(e);
        }
    }

    async unlinkCode(req, res, next) {
        try {
            const {code} = req.body;
            const unlink = await affiliateService.unlinkCode(code);
            return res.json(unlink);
        } catch(e) {
            next(e);
        }
    }
}

export default new affiliateController();