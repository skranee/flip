import depositService from "../services/depositService.js";

class DepositController {
    async getAccountId(req, res, next) {
        try {
            const currency = req.query.currency;
            const id = await depositService.getAccountId(currency);
            return res.json(id);
        } catch(e) {
            next(e);
        }
    }

    async createPaymentAddress(req, res, next) {
        try {
            const {currency, user} = req.body;
            const address = await depositService.createPaymentAddress(currency, user);
            return res.json(address);
        } catch(e) {
            next(e);
        }
    }

    async findAddress(req, res, next) {
        try {
            const {user, currency} = req.body;
            const address = await depositService.findAddress(user, currency);
            return res.json(address);
        } catch(e) {
            next(e);
        }
    }

    async getTransactions(req, res, next) {
        try {
            const response = await depositService.getTransactions();
            return res.json(response);
        } catch(e) {
            next(e);
        }
    }

    async getNotified(req, res, next) {
        try {
            const eventData = req.body;
            const forward = await depositService.getNotified(eventData);
            return res.status(200).end();
        } catch(e) {
            next(e);
        }
    }
}

export default new DepositController();