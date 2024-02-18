import historyService from "../services/historyService.js";

class HistoryController {
    async addHistory(req, res, next) {
        try {
            const {game} = req.body;
            const add = await historyService.addHistory(game);
            return res.json(add)
        } catch(e) {
            next(e);
        }
    }
}

export default new HistoryController();