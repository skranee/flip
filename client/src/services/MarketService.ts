import $api from "../http";
import {AxiosResponse} from "axios";
import {IItem} from "../models/IItem";

export default class MarketService {
    static async addItemMarket(item: IItem): Promise <AxiosResponse> {
        return $api.post('/market', {item});
    }

    static async getItemsMarket(): Promise <AxiosResponse<IItem[]>> {
        return $api.get('/market');
    }

    static async removeItemMarket(itemId: string): Promise <AxiosResponse> {
        return $api.post('/marketRemove', {itemId});
    }

    static async buyItemMarket(itemId: string): Promise <AxiosResponse> {
        return $api.put('/market', {itemId});
    }
}