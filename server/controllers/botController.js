import botService from "../services/botService.js";

class BotController {
    async decideWhichBot(req, res, next) {
        const {items} = req.body;
        const response = await botService.decideWhichBot(items);
        return res.json(response);
    }

    async parseHtml(req, res, next) {
        try {
            const {itemName} = req.body;
            const item = await botService.parseHtml(itemName);
            return res.json(item);
        } catch(e) {
            next(e);
        }
    }

    async completeWithdraw(req, res, next) {
        try {
            const {robloxId} = req.body;
            const check = await botService.completeWithdraw(robloxId);
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