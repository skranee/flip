import gameModel from "../models/game-model.js";
import ApiError from "../exceptions/api-error.js";
import {v4 as uuidv4} from 'uuid';
import userModel from "../models/user-model.js";

class GameService {
    async createGame(player1, items, side) {
        const gameId = uuidv4();
        const game = await gameModel.create({player1: player1.id, items1: items, gameId: gameId, side1: side});
        return game;
    }

    async joinGame(player2, items, side, gameId) {
        const game = await gameModel.findOneAndUpdate({gameId: gameId}, {player2: player2.id, items2: items, side2: side, status: 'Ongoing'});
        return game;
    }

    async getGames() {
        const games = await gameModel.find().populate('player1').populate('player2');
        return games;
    }

    async deleteGame(gameId) {
        const game = await gameModel.findOne({gameId: gameId});
        const player1 = await userModel.findOneAndUpdate({_id: game.player1}, {$inc: {gamesPlayed: 1}});//only for ended games not for canceled
        const player2 = await userModel.findOneAndUpdate({_id: game.player2}, {$inc: {gamesPlayed: 1}});//only for ended games not for canceled
        const end = await gameModel.deleteOne({gameId: gameId});
        return end;
    }
}

export default new GameService();