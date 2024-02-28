import withdrawModel from "../models/withdraw-model.js";
import botModel from "../models/bot-model.js";
import {ObjectId} from "mongodb";

class WithdrawService {
    async addToQueue(robloxId, items) {
        for(const item of items) {
            await botModel.deleteOne({itemId: item.itemId});
        }
        const names = items.map(item => item.name);
        const add = await withdrawModel.create({userId: robloxId, items: names});
        return add;
    }

    async clearQueue() {
        const clear = await withdrawModel.deleteMany();
        return clear;
    }
}

export default new WithdrawService();