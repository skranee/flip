import historyModel from "../models/history-model.js";
import userModel from "../models/user-model.js";

class HistoryService {
    async addHistory(game) {
        const update = await userModel.updateMany(
            {$or: [{_id: game.player1}, {_id: game.player2}]}, {$inc: {gamesPlayed: 1}});
        await userModel.updateOne({_id: game.player1}, {$inc: {totalWagered: game.items1.reduce((a, b) => a + b.price, 0) / 2.5}});
        await userModel.updateOne({_id: game.player2}, {$inc: {totalWagered: game.items2.reduce((a, b) => a + b.price, 0) / 2.5}});
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
        const totalWorth = game.items1.reduce((a, b) => a + b.price, 0) / 2.5 + game.items2.reduce((a, b) => a + b.price, 0) / 2.5;
        const add = await historyModel.create({
            date: formattedDate, result: result, player1: player1._id, player2: player2._id, totalWorth: totalWorth});
        return add;
    }
}

export default new HistoryService();