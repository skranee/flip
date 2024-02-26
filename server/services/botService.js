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

    async addItemBot(robloxId, items) {
        const user = await userModel.findOne({robloxId: robloxId});
        if(!user) {
            throw ApiError.BadRequest('User with this robloxId was not found');
        }
        let newItems = [];
        for(const item of items) {
            for(let i = 0; i < item.quantity; ++i) {
                const id = uuidv4();
                const add = await botModel.create(
                    {
                        name: item.name,
                        owner: user._id,
                        rarity: 'rare', //item.rarity
                        classification: 'gun', //item.classification
                        image: '', //item.image
                        price: item.price,
                        itemId: id
                    });
                newItems.push(add);
            }
        }
        return newItems.map(item => ({
            name: item.name,
            rarity: 'rare', //item.rarity
            classification: 'gun', //item.classification
            image: '', //item.image
            price: item.price,
            itemId: item.id
        }));
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