import gameModel from "../models/game-model.js";
import ApiError from "../exceptions/api-error.js";
import {v4 as uuidv4} from 'uuid';

class GameService {
    async createGame(player1, items) {
        const gameId = uuidv4();
        const game = await gameModel.create({player1: player1.id, items1: items, gameId: gameId});
        return game;
    }

    async getGames() {
        const games = await gameModel.find().populate('player1').populate('player2');
        return games;
    }

    async deleteGame(gameId) {
        const end = await gameModel.deleteOne({gameId: gameId});
        return end;
    }
}

export default new GameService();