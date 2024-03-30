import gameService from "../services/gameService.js";

class GameController {
    async createGame(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {items, side} = req.body;
            const game = await gameService.createGame(refreshToken, items, side);
            return res.json(game);
        } catch(e) {
            next(e);
        }
    }

    async createWithGems(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {gemsAmount, side} = req.body;
            const game = await gameService.createWithGems(refreshToken, gemsAmount, side);
            return res.json(game);
        } catch(e) {
            next(e);
        }
    }

    async joinGame(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {items, side, gameId} = req.body;
            const join = await gameService.joinGame(refreshToken, items, side, gameId);
            return res.json(join);
        } catch(e) {
            next(e);
        }
    }

    async joinWithGems(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {side, gameId, gemsAmount} = req.body;
            const join = await gameService.joinWithGems(refreshToken, side, gameId, gemsAmount);
            return res.json(join);
        } catch(e) {
            next(e);
        }
    }

    async cancelGame(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {game} = req.body;
            const cancel = await gameService.cancelGame(refreshToken, game);
            return res.json(cancel);
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