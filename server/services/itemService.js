import itemModel from "../models/itemModel.js";

class ItemService {
    async createItem(name, value) {
        const item = await itemModel.create({name: name, value: value})
        return item;
    }
}

export default new ItemService();