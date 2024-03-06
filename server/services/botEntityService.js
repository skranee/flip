import botEntityModel from "../models/botEntity-model.js";

class BotEntityService {
    async getBots() {
        const bots = await botEntityModel.find();
        return bots;
    }

    async addBot(robloxId, serverUrl, avatar, name) {
        const bot = await botEntityModel.create({robloxId: robloxId, serverUrl: serverUrl, avatar: avatar, name: name});
        return bot;
    }
}

export default new BotEntityService();