import withdrawModel from "../models/withdraw-model.js";
import botModel from "../models/bot-model.js";
import {ObjectId} from "mongodb";
import ApiError from "../exceptions/api-error.js";
import botEntityService from "./botEntityService.js";

class WithdrawService {
    async addToQueue(robloxId, items) {
        const candidate = await withdrawModel.findOne({userId: robloxId});
        const bots = await botEntityService.getBots();
        let botName = '';
        if(candidate) {
            return ApiError.BadRequest('You are already in the queue with other items')
        }
        const botItems = await botModel.find();
        const botItems0 = botItems.filter(item => item.holder === bots[0].name);
        const botItems1 = botItems.filter(item => item.holder === bots[1].name);
        // const botItems2 = botItems.filter(item => item.holder === bots[2].name);
        let count0 = 0;
        let count1 = 0;
        // let count2 = 0;
        let itemsWithdraw0 = [];
        let itemsWithdraw1 = [];
        // let itemsWithdraw2 = [];
        let itemsWithdraw = [];
        for(let i = 0; i < items.length; ++i) {
            for(let j = 0; j < botItems0.length; ++j) {
                if(items[i].itemId === botItems0[j].itemId) {
                    botItems0[j] = {};
                    itemsWithdraw0.push(items[i]);
                    count0++;
                    break
                }
            }
        }
        for(let i = 0; i < items.length; ++i) {
            for(let j = 0; j < botItems1.length; ++j) {
                if(items[i].itemId === botItems1[j].itemId) {
                    botItems1[j] = {};
                    itemsWithdraw1.push(items[i]);
                    count1++;
                    break
                }
            }
        }
        // for(let i = 0; i < items.length; ++i) {
        //     for(let j = 0; j < botItems2.length; ++j) {
        //         if(items[i].itemId === botItems2[j].itemId) {
        //             botItems2[j] = {};
        //             itemsWithdraw2.push(items[i]);
        //             count2++;
        //             break
        //         }
        //     }
        // }
        const max = Math.max(count0, count1);
        if(count0 === max) {
            itemsWithdraw = itemsWithdraw0;
            botName = bots[0].name;
        }
        else if(count1 === max) {
            itemsWithdraw = itemsWithdraw1;
            botName = bots[1].name;
        }
        // else if(count2 === max) {
        //     itemsWithdraw = itemsWithdraw2;
        //     botName = bots[2].name;
        // }
        const itemsNames = itemsWithdraw.map(item => item.gameName);
        let uniqueItems = itemsNames.filter((item, index) => itemsNames.indexOf(item) === index);
        if(uniqueItems.length > 4) {
            let newWithdraw = [];
            uniqueItems = uniqueItems.slice(0, 4);
            for(let i = 0; i < itemsWithdraw.length; ++i) {
                for(let j = 0; j < uniqueItems.length; ++j) {
                    if(itemsWithdraw[i].gameName === uniqueItems[j]) {
                        newWithdraw.push(itemsWithdraw[i]);
                        break;
                    }
                }
            }
            itemsWithdraw = newWithdraw;
        }
        for(const item of itemsWithdraw) {
            const remove = await botModel.deleteOne({itemId: item.itemId});
        }
        const names = itemsWithdraw.map(item => item.gameName);
        const add = await withdrawModel.create({userId: robloxId, items: names, fullItems: itemsWithdraw, botName: botName});
        return {
            queuePlace: add,
            botName: botName
        };
    }

    async clearQueue() {
        const clear = await withdrawModel.deleteMany();
        return clear;
    }
}

export default new WithdrawService();