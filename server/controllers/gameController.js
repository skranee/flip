import gameService from "../services/gameService.js";

class GameController {
    async createGame(req, res, next) {
        try {
            const {player1, items, side} = req.body;
            const game = gameService.createGame(player1, items, side);
            return res.json(game);
        } catch(e) {
            next(e);
        }
    }

    async joinGame(req, res, next) {
        try {
            const {player2, items, side, gameId} = req.body;
            const join = await gameService.joinGame(player2, items, side, gameId);
            return res.json(join);
        } catch(e) {
            next(e);
        }
    }

    async getGames(req, res, next) {
        try {
            const games = await gameService.getGames();
            return res.json(games);
        } catch(e) {
            next(e);
        }
    }

    async deleteGame(req, res, next) {
        try {
            const {gameId} = req.body;
            const response = await gameService.deleteGame(gameId);
            return res.json(response);
        } catch(e) {
            next(e);
        }
    }
}

export default new GameController();