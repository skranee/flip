import depositService from "../services/depositService.js";

class DepositController {
    async createPaymentAddress(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {currency} = req.body;
            const address = await depositService.createPaymentAddress(currency, refreshToken);
            return res.json(address);
        } catch(e) {
            next(e);
        }
    }

    async findAddress(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {currency} = req.body;
            const address = await depositService.findAddress(refreshToken, currency);
            return res.json(address);
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