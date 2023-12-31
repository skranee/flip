import gameService from "../services/gameService.js";

class GameController {
    async createGame(req, res, next) {
        try {
            const {player1, items} = req.body;
            const game = gameService.createGame(player1, items);
            return res.json(game);
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