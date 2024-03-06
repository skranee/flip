import botEntityService from "../services/botEntityService.js";

class BotEntityController {
    async getBots(req, res, next) {
        try {
            const bots = await botEntityService.getBots();
            return res.json(bots);
        } catch(e) {
            next(e);
        }
    }

    async addBot(req, res, next) {
        try {
            const {robloxId, avatar, name, serverUrl} = req.body;
            const create = await botEntityService.addBot(robloxId, serverUrl, avatar, name);
            return res.json(create);
        } catch(e) {
            next(e);
        }
    }
}

export default new BotEntityController();