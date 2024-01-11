import marketService from "../services/marketService.js";

class MarketController {
    async addItemMarket(req, res, next) {
        try {
            const {userId, item} = req.body;
            const add = await marketService.addItemMarket(userId, item);
            return res.json(add);
        } catch(e) {
            next(e);
        }
    }

    async removeItemMarket(req, res, next) {
        try {
            const {itemId} = req.body;
            const remove = await marketService.removeItemMarket(itemId);
            return res.json(remove);
        } catch(e) {
            next(e);
        }
    }

    async buyItemMarket(req, res, next) {
        try {
            const {ownerId, buyerId, itemId} = req.body;
            const buy = await marketService.buyItemMarket(ownerId, buyerId, itemId);
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