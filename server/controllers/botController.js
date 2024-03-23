import botService from "../services/botService.js";

class BotController {
    async completeWithdraw(req, res, next) {
        try {
            const {key, robloxId} = req.body;
            const check = await botService.completeWithdraw(key, robloxId);
            return res.json(check);
        } catch(e) {
            next(e);
        }
    }

    async addItemBot(req, res, next) {
        try {
            const {key, robloxId, Data} = req.body;
            const add = await botService.addItemBot(key, robloxId, Data);
            return res.json(add);
        } catch(e) {
            next(e);
        }
    }

    async getWithdrawData(req, res, next) {
        try {
            const withdraw = await botService.getWithdrawData();
            return res.json(withdraw);
        } catch(e) {
            next(e);
        }
    }

    async getUserItems(req, res, next) {
        try {
            const userId = req.query.userId;
            const items = await botService.getUserItems(userId);
            return res.json(items);
        } catch(e) {
            next(e);
        }
    }

    async getGiveawayItems(req, res, next) {
        try {
            const adminId = req.query.adminId;
            const items = await botService.getGiveawayItems(adminId);
            return res.json(items);
        } catch(e) {
            next(e);
        }
    }

    async checkIncluded(req, res, next) {
        try {
            const {items} = req.body;
            const check = await botService.checkIncluded(items);
            return res.json(check);
        } catch(e) {
            next(e);
        }
    }

    async startGiveaway(req, res, next) {
        try {
            const {adminId, items} = req.body;
            const create = await botService.startGiveaway(adminId, items);
            return res.json(create);
        } catch(e) {
            next(e);
        }
    }
}

export default new BotController();