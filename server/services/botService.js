import botModel from "../models/bot-model.js";
import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";
import {v4 as uuidv4} from 'uuid';
import withdrawModel from "../models/withdraw-model.js";
import cheerio from "cheerio";
import axios from "axios";
import {mm2items} from "../mm2items.js";

class BotService {
    async decideWhichBot(items) {
        const botItems = await botModel.find();
        const botItems1 = botItems.filter(item => item.holder === 1);
        const botItems2 = botItems.filter(item => item.holder === 2);
        const botItems3 = botItems.filter(item => item.holder === 3);
        let neededItems1 = [];
        let neededItems2 = [];
        let neededItems3 = [];
        for(const botItem of botItems1) {
            for(const item of items) {
                if(item === botItem) {
                    neededItems1.push(botItem);
                    return;
                }
            }
        }
        for(const botItem of botItems2) {
            for(const item of items) {
                if(item === botItem) {
                    neededItems2.push(botItem);
                    return;
                }
            }
        }
        for(const botItem of botItems3) {
            for(const item of items) {
                if(item === botItem) {
                    neededItems3.push(botItem);
                    return;
                }
            }
        }
        const maxLength = Math.max(neededItems1.length, neededItems2.length, neededItems3.length);
        let neededItemsFinal = [];
        let botId = '';
        if(neededItems1.length === maxLength) {
            neededItemsFinal = neededItems1;
            botNumber = 1;
        }
        else if(neededItems2.length === maxLength) {
            neededItemsFinal = neededItems2;
            botNumber = 2;
        }
        else {
            neededItemsFinal = neededItems3;
            botNumber = 3;
        }

        return {
            items: neededItemsFinal,
            botNumber: botNumber
        }
    }

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

    async parseHtml(itemName) {
        let itemImage = '';
        let rarity = '';
        let classification = '';
        let price = '';
        const items = Object.values(mm2items);
        const itemFromDB = items.find(item => item.ItemName.replace(/\s/g, '').toLowerCase() === itemName.replace(/\s/g, '').toLowerCase());
        if(itemFromDB && itemFromDB.Image) {
            itemImage = `https://assetdelivery.roproxy.com/v1/asset?id=${parseInt(itemFromDB.Image)}`;
            if(itemFromDB.Rarity) {
                const response = await axios.get(`https://mm2values.com/?p=${itemFromDB.Rarity.toLowerCase()}`);
                const htmlContent = response.data;
                const $ = cheerio.load(htmlContent);
                const neededItem = $(`.linkTable:contains(${itemFromDB.ItemName})`).first();

                if(neededItem.length && neededItem.length > 0) {
                    const valueMatch = neededItem.text().match(/VALUE: (\d+)/);
                    price = valueMatch ? valueMatch[1] : 0;
                } else {
                    const tryAgain = $(`.linkTable:contains(${itemFromDB.ItemName.replace(/\s/g, '')})`).first();
                    const valueMatch = tryAgain.text().match(/VALUE: (\d+)/);
                    price = valueMatch ? valueMatch[1] : 0;
                }

                rarity = itemFromDB.Rarity;
            }
            if(itemFromDB.ItemType) {
                classification = itemFromDB.ItemType;
            }
        }
        else {
            //...
        }
        const item = {
            name: itemFromDB.ItemName,
            rarity: rarity,
            classification: classification,
            image: itemImage,
            price: price
        }

        return item;
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
                const parsedInfo = await this.parseHtml(item.name);
                const add = await botModel.create(
                    {
                        name: parsedInfo.name,
                        owner: user._id,
                        rarity: parsedInfo.rarity,
                        classification: parsedInfo.classification,
                        image: parsedInfo.image,
                        price: parsedInfo.price,
                        itemId: id,
                        holder: item.holder,
                        gameName: item.name
                    });
                newItems.push(add);
            }
        }
        return newItems;
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