import gameService from "../services/gameService.js";

class GameController {
    async createGame(req, res, next) {
        try {
            const {player1, items, side} = req.body;
            const game = await gameService.createGame(player1, items, side);
            return res.json(game);
        } catch(e) {
            next(e);
        }
    }

    async createWithGems(req, res, next) {
        try {
            const {player1, gemsAmount, side} = req.body;
            const game = await gameService.createWithGems(player1, gemsAmount, side);
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

    async joinWithGems(req, res, next) {
        try {
            const {player2, side, gameId, gemsAmount} = req.body;
            const join = await gameService.joinWithGems(player2, side, gameId, gemsAmount);
            return res.json(join);
        } catch(e) {
            next(e);
        }
    }

    async cancelGame(req, res, next) {
        try {
            const {user, game} = req.body;
            const cancel = await gameService.cancelGame(user, game);
            return res.json(cancel);
        } catch(e) {
            next(e);
        }
    }

    async findWinner(req, res, next) {
        try {
            const gameId = req.query.gameId;
            const response = await gameService.findWinner(gameId);
            return res.json(response);
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