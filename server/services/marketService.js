import marketModel from "../models/market-model.js";
import userModel from "../models/user-model.js";

class MarketService {
    async addItemMarket(userId, item) {
        const user = await userModel.findOneAndUpdate({_id: userId}, {$pull: {itemsList: {_id: item._id}}});
        const add = await marketModel.create(
            {name: item.name, owner: userId, rarity: item.rarity, classification: item.classification, price: item.price, image: item.image});
        return add;
    }

    async removeItemMarket(itemId) {
        const remove = await marketModel.deleteOne({_id: itemId});
        return remove;
    }

    async buyItemMarket(ownerId, buyerId, itemId) {
        let item = await marketModel.findOne({_id: itemId});
        item.owner = buyerId;
        const buyer = await userModel.findOneAndUpdate({_id: buyerId}, {$push: {itemsList: item}, $inc: {balance: Math.round(-item.price / 2.5)}});
        const sell = await userModel.findOneAndUpdate({_id: ownerId}, {$pull: {itemsList: {_id: itemId}}, $inc: {balance: Math.round(item.price / 2.5)}});
        const removeFromMarket = await marketModel.findOneAndDelete({_id: itemId});
        return removeFromMarket;
    }

    async getItemsMarket(req, res, next) {
        const items = await marketModel.find();
        return items;
    }
}

export default new MarketService();