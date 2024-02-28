import historyModel from "../models/history-model.js";
import userModel from "../models/user-model.js";
import axios from "axios";
import cheerio from "cheerio";

class HistoryService {
    async addHistory(game) {
        let bet1 = 0;
        let bet2 = 0;
        const update = await userModel.updateMany(
            {$or: [{_id: game.player1}, {_id: game.player2}]}, {$inc: {gamesPlayed: 1}});
        if(game.items1) {
            await userModel.updateOne({_id: game.player1}, {$inc: {totalWagered: game.items1.reduce((a, b) => a + b.price, 0) / 2.5}});
            bet1 = Math.round(game.items1.reduce((a, b) => a + b.price, 0) / 2.5);
        }
        if(game.items2) {
            await userModel.updateOne({_id: game.player2}, {$inc: {totalWagered: game.items2.reduce((a, b) => a + b.price, 0) / 2.5}});
            bet2 = Math.round(game.items2.reduce((a, b) => a + b.price, 0) / 2.5);
        }
        if(game.gems1) {
            await userModel.updateOne({_id: game.player1}, {$inc: {totalWagered: game.gems1}});
            bet1 = game.gems1;
        }
        if(game.gems2) {
            await userModel.updateOne({_id: game.player2}, {$inc: {totalWagered: game.gems2}});
            bet2 = game.gems2;
        }
        const today = new Date();
        const options = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        const formattedDate = today.toLocaleDateString('en-US', options);

        const result = game.result;
        const player1 = game.player1;
        const player2 = game.player2;
        const totalWorth = Math.round(bet1 + bet2);
        const add = await historyModel.create({
            date: formattedDate, result: result, player1: player1._id, player2: player2._id, totalWorth: totalWorth});
        return add;
    }
}

export default new HistoryService();