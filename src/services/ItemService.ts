import $api from "../http";
import {AxiosResponse} from "axios";
import ItemResponse from "../models/response/ItemResponse";

export default class ItemService {
    static async createItem(name: string, value: number): Promise<AxiosResponse<ItemResponse>> {
        return $api.post('/createItem', {name, value});
    }
}