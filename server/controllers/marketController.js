import marketService from "../services/marketService.js";

class MarketController {
    async addItemMarket(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {item} = req.body;
            const add = await marketService.addItemMarket(refreshToken, item);
            return res.json(add);
        } catch(e) {
            next(e);
        }
    }

    async removeItemMarket(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {itemId} = req.body;
            const remove = await marketService.removeItemMarket(refreshToken, itemId);
            return res.json(remove);
        } catch(e) {
            next(e);
        }
    }

    async buyItemMarket(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {itemId} = req.body;
            const buy = await marketService.buyItemMarket(refreshToken, itemId);
            return res.json(buy);
        } catch(e) {
            next(e);
        }
    }

    async getItemsMarket(req, res, next) {
        try {
            const items = await marketService.getItemsMarket();
            return res.json(items);
        } catch(e) {
            next(e);
        }
    }
}

export default new MarketController();