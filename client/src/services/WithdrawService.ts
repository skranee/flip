import $api from "../http";
import Item from "../models/Item";
import {AxiosResponse} from "axios";

export default class WithdrawService {
    static async addToQueue(robloxId: string, items: Item[]): Promise<AxiosResponse> {
        return $api.post('/withdraw', {robloxId, items});
    }
}