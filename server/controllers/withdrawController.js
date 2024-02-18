import withdrawService from "../services/withdrawService.js";

class WithdrawController {
    async addToQueue(req, res, next) {
        try {
            const {robloxId, items} = req.body;
            const add = await withdrawService.addToQueue(robloxId, items);
            return res.json(add);
        } catch (e) {
            next(e);
        }
    }
}

export default new WithdrawController();