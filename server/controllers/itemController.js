import itemService from "../services/itemService.js";

class ItemController {
    async createItem(req, res, next) {
        try {
            const {name, value} = req.body;
            const item = await itemService.createItem(name, value);
            return res.json(item);
        } catch(e) {
            next(e);
        }
    }
}

export default new ItemController();