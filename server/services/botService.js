import botModel from "../models/bot-model.js";
import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";
import {v4 as uuidv4} from 'uuid';
import withdrawModel from "../models/withdraw-model.js";

class BotService {
    async completeWithdraw(robloxId) {
        const user = await withdrawModel.findOne({userId: robloxId});
        if(user) {
            const removeFromQueue = await withdrawModel.deleteOne({userId: robloxId});
            return {
                success: true
            }
        }
        return {
            success: false
        }
    }

    async addItemBot(robloxId, item) {
        const user = await userModel.findOne({robloxId: robloxId});
        if(!user) {
            throw ApiError.BadRequest('User with this robloxId was not found');
        }
        const id = uuidv4();
        const add = await botModel.create(
            {
                name: item.name,
                owner: user._id,
                rarity: item.rarity,
                classification: item.classification,
                image: item.image,
                price: item.price,
                itemId: id
            });
        return add;
    }

    async getWithdrawData() {
        const data = await withdrawModel.find();
        return data;
    }

    async getUserItems(userId) {
        const itemsList = await botModel.find({owner: userId});
        return itemsList;
    }
}

export default new BotService();