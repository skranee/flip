import botService from "../services/botService.js";

class BotController {
    async completeWithdraw(req, res, next) {
        try {
            const {userId} = req.body;
            const check = await botService.completeWithdraw(userId);
            return res.json(check);
        } catch(e) {
            next(e);
        }
    }

    async addItemBot(req, res, next) {
        try {
            const {robloxId, Data} = req.body;
            const add = await botService.addItemBot(robloxId, Data);
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
}

export default new BotController();