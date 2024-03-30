import marketModel from "../models/market-model.js";
import userModel from "../models/user-model.js";
import botModel from "../models/bot-model.js";
import {ObjectId} from "mongodb";
import axios from "axios";
import tokenService from "./token-service.js";
import ApiError from "../exceptions/api-error.js";

class MarketService {
    async addItemMarket(refreshToken, item) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
        let ownership = false;
        const botItems = await botModel.find();
        for(const botItem of botItems) {
            if(item.itemId === botItem.itemId) {
                if(botItem.owner.toString() === userId.toString()) {
                    ownership = true;
                }
            }
        }
        if(!ownership) {
            return ApiError.BadRequest('Fake item!');
        }
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

    async removeItemMarket(refreshToken, itemId) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
        let ownership = false;
        const marketItems = await marketModel.find();
        for(const item of marketItems) {
            if(itemId === item.itemId) {
                if(item.owner.toString() === userId.toString()) {
                    ownership = true;
                }
            }
        }
        if(!ownership) {
            return ApiError.BadRequest('Not allowed!');
        }

        const item = await marketModel.findOne({itemId: itemId});
        const itemBot = await botModel.updateOne({itemId: itemId}, {owner: item.owner});
        const remove = await marketModel.deleteOne({itemId: itemId});
        return remove;
    }

    async buyItemMarket(refreshToken, itemId) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const buyerId = tokenData.user;
        const user = await userModel.findOne({_id: tokenData.user});

        let item = await marketModel.findOne({itemId: itemId});
        if(user.balance < item.price) {
            return ApiError.BadRequest('Not enough balance');
        }
        const ownerId = item.owner;

        await userModel.updateOne({_id: buyerId}, {$inc: {balance: Math.round(-item.price)}});
        await userModel.updateOne({_id: ownerId}, {$inc: {balance: Math.round(0.9 * item.price)}});
        await botModel.updateOne({itemId: itemId}, {owner: buyerId});

        const removeFromMarket = await marketModel.findOneAndDelete({itemId: itemId});
        return removeFromMarket;
    }

    async getItemsMarket() {
        const items = await marketModel.find();
        return items;
    }
}

export default new MarketService();