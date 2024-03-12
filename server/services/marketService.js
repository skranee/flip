import marketModel from "../models/market-model.js";
import userModel from "../models/user-model.js";
import botModel from "../models/bot-model.js";
import {ObjectId} from "mongodb";
import axios from "axios";

class MarketService {
    async addItemMarket(userId, item) {
        const itemBot = await botModel.updateOne({itemId: item.itemId}, {owner: new ObjectId('000000000000000000000000')})
        const add = await marketModel.create(
            {
                name: item.name,
                owner: userId,
                price: item.price,
                image: item.image,
                itemId: item.itemId
            });
        return add;
    }

    async removeItemMarket(itemId) {
        const item = await marketModel.findOne({itemId: itemId});
        const itemBot = await botModel.updateOne({itemId: itemId}, {owner: item.owner});
        const remove = await marketModel.deleteOne({itemId: itemId});
        return remove;
    }

    async buyItemMarket(ownerId, buyerId, itemId) {
        let item = await marketModel.findOne({itemId: itemId});
        const buyer = await userModel.updateOne({_id: buyerId}, {$inc: {balance: Math.round(-item.price)}});
        const sell = await userModel.updateOne({_id: ownerId}, {$inc: {balance: Math.round(0.9 * item.price)}});
        const newOwner = await botModel.updateOne({itemId: itemId}, {owner: buyerId});
        const removeFromMarket = await marketModel.findOneAndDelete({itemId: itemId});
        return removeFromMarket;
    }

    async getItemsMarket() {
        const items = await marketModel.find();
        return items;
    }
}

export default new MarketService();