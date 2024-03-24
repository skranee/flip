import botModel from "../models/bot-model.js";
import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";
import {v4 as uuidv4} from 'uuid';
import withdrawModel from "../models/withdraw-model.js";
import cheerio from "cheerio";
import axios from "axios";
import {ObjectId} from "mongodb";
import userService from "./user-service.js";

const imageLink = 'https://ibb.co/J7DD8Qf';

let items = [];

const updateItems = async () => {
    const html = await axios.get('https://www.mm2values.com/index.php?p=searchresults&i1=&i2=&i3=');
    const $ = cheerio.load(html.data);

    $('table.valueTable').each((index, table) => {
        const nameCell = $(table).find('td').eq(1);
        const nameText = nameCell.find('b').text().trim();

        if (nameText) {
            const valueMatch = $(table).find('td').eq(0).text().match(/Value: (\d+)/);
            const value = valueMatch ? parseInt(valueMatch[1], 10) : 0;

            const regex = /Value: (\d+)/
            const match = nameText.match(regex);
            const valueNumber = match ? match[1] : value
            const name = nameText.replace(/Value:.*$/, '');
            items.push({ name: name, value: valueNumber });
        }
    });
}

updateItems();

setInterval(async () => {
    await updateItems();
}, 1000 * 60 * 60 * 5)

class BotService {
    async completeWithdraw(key, robloxId) {
        if(key !== process.env.API_KEY) {
            return ApiError.BadRequest('You are not allowed to do that');
        }
        const user = await withdrawModel.findOne({userId: robloxId});
        if(user && user.fullItems) {
            for(const item of user.fullItems) {
                await userModel.updateOne({robloxId: robloxId}, {$inc: {totalWithdrawn: item.price}});
            }
        }
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

    async parseHtml(itemName, item) {
        let itemImage = '';
        let url = '';

        if(item.assetId) {
            url = item.assetId;
        }

        const regex = /assetId=(\d+)/;
        const match = url.match(regex);

        let assetIdItem = 0;

        if(match) {
            assetIdItem = match[1];
        }

        const regex2 = /id=(\d+)/;
        const match2 = url.match(regex2);

        if(match2) {
            assetIdItem = match2[1];
        }

        const regex3 = /rbxassetid:\/\/(\d+)/;
        const match3 = url.match(regex3);

        if(match3) {
            assetIdItem = match3[1];
        }

        // const headers = {
        //     "x-api-key": process.env.ROBLOX_API_KEY
        // }
        // let assetResponse = {};
        // try {
        //     assetResponse = await axios.get(`https://apis.roblox.com/assets/v1/assets/${assetIdItem}`, {headers});
        // } catch(e) {
        //     assetResponse = {};
        // }
        // let assetId = '';
        // if(assetResponse && assetResponse.data) {
        //     assetId = assetResponse.data.assetId;
        // }
        // let imageResponse = {};
        // try {
        //     imageResponse = await axios.get(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetIdItem}&returnPolicy=PlaceHolder&size=700x700&format=Png&isCircular=false`);
        // } catch(e) {
        //     imageResponse = {};
        // }
        // if(imageResponse && imageResponse.data) {
        //     itemImage = imageResponse.data.data[0].imageUrl;
        // } else {
        //     itemImage = imageLink;
        // }

        const itemParsed = items.filter(item => item.name.replace(/\s/g, '').toLowerCase() === itemName.replace(/\s/g, '').toLowerCase())[0];

        return {
            assetId: assetIdItem,
            name: itemParsed.name,
            price: itemParsed.value
        }
    }

    async addItemBot(key, robloxId, items) {
        if(key !== process.env.API_KEY) {
            return ApiError.BadRequest('You are not allowed to do that');
        }
        let user = await userModel.findOne({robloxId: robloxId});
        if(!user) {
            const response = await axios.get(`https://users.roblox.com/v1/users/${robloxId}`);
            if(response && response.data) {
                await userService.saveToDB({id: robloxId, name: response.data.name});
            }
            user = await userModel.findOne({robloxId: robloxId});
        }
        let newItems = [];
        for(const item of items) {
            for(let i = 0; i < item.quantity; ++i) {
                const id = uuidv4();
                const parsedInfo = await this.parseHtml(item.name, item);
                const assetIdItem = parsedInfo.assetId;
                try {
                    const imageResponse = await axios.get(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetIdItem}&returnPolicy=PlaceHolder&size=700x700&format=Png&isCircular=false`);
                    let itemImage = '';
                    if(imageResponse && imageResponse.data) {
                        itemImage = imageResponse.data.data[0].imageUrl;
                    } else {
                        itemImage = imageLink;
                    }
                    const add = await botModel.create(
                        {
                            name: parsedInfo.name,
                            owner: user._id,
                            image: itemImage,
                            price: parsedInfo.price * process.env.CURRENCY_CONVERTER,
                            itemId: id,
                            holder: item.holder,
                            gameName: item.gameName
                        });
                    newItems.push(add);
                } catch(e) {
                    console.log(e)
                }
            }
        }
        return newItems;
    }

    async checkIncluded (itemsForCheck) {
        let excluded = [];
        for(let i = 0; i < itemsForCheck.length; ++i) {
            const check = items.filter(check => check.name.replace(/\s/g, '').toLowerCase() === itemsForCheck[i].replace(/\s/g, '').toLowerCase())[0];
            if(!check) {
                excluded.push(itemsForCheck[i]);
            }
        }
        if(excluded.length > 0) {
            return excluded;
        }
        return true;
    }

    async getWithdrawData() {
        const data = await withdrawModel.find();
        return data;
    }

    async getUserItems(userId) {
        const itemsList = await botModel.find({owner: userId});
        return itemsList;
    }

    async getGiveawayItems(adminId) {
        const check = await userModel.findOne({_id: adminId});
        if(!check || check.role !== 'admin') {
            return ApiError.BadRequest('Not enough right to do that');
        }
        const items = await botModel.find({owner: '65eb934f623b869cf8035057'});
        return items;
    }

    async startGiveaway(adminId, items) {
        const check = await userModel.find({_id: adminId});
        if(!check || check.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights to create a giveaway');
        }
        for(const item of items) {
            await botModel.updateOne({itemId: item.itemId}, {owner: new ObjectId('111111111111111111111111')});
        }
        return items;
    }

    async endGiveaway(items, winner) {
        for(const item of items) {
            await botModel.updateOne({itemId: item.itemId}, {owner: winner.id});
        }
    }
}

export default new BotService();