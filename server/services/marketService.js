import marketModel from "../models/market-model.js";
import userModel from "../models/user-model.js";
import botModel from "../models/bot-model.js";
import {ObjectId} from "mongodb";
import axios from "axios";

class MarketService {
    async addItemMarket(userId, item) {
        const itemBot = await botModel.findOneAndUpdate({itemId: item.itemId}, {owner: new ObjectId('000000000000000000000000')})
        const add = await marketModel.create(
            {
                name: item.name,
                owner: userId,
                rarity: item.rarity,
                classification: item.classification,
                price: item.price,
                image: item.image,
                itemId: item.itemId
            });
        return add;
    }

    async removeItemMarket(itemId) {
        const item = await marketModel.findOne({itemId: itemId});
        const itemBot = await botModel.findOneAndUpdate({itemId: itemId}, {owner: item.owner});
        const remove = await marketModel.deleteOne({itemId: itemId});
        return remove;
    }

    async buyItemMarket(ownerId, buyerId, itemId) {
        let item = await marketModel.findOne({itemId: itemId});
        const buyer = await userModel.findOneAndUpdate({_id: buyerId}, {$inc: {balance: Math.round(-item.price / 2.5)}});
        const sell = await userModel.findOneAndUpdate({_id: ownerId}, {$inc: {balance: Math.round(item.price / 2.5)}});
        const newOwner = await botModel.findOneAndUpdate({itemId: itemId}, {owner: buyerId});
        const removeFromMarket = await marketModel.findOneAndDelete({itemId: itemId});
        return removeFromMarket;
    }

    async getItemsMarket() {
        const items = await marketModel.find();
        return items;
    }
}

export default new MarketService();