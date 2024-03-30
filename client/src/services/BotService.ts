import $api from "../http";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import {WithdrawResponse} from "../models/response/WithdrawResponse";

export default class BotService {
    static async getWithdrawData(): Promise<AxiosResponse<WithdrawResponse>> {
        return $api.get(`/withdraw`);
    }

    static async getUserItems(): Promise<AxiosResponse<IItem[]>> {
        return $api.get(`/getUserItems`);
    }

    static async getGiveawayItems(): Promise<AxiosResponse<IItem[]>> {
        return $api.get(`/giveawayItems`);
    }

    static async startGiveaway(adminId: string, items: IItem[]): Promise<AxiosResponse<IItem[]>> {
        return $api.post('/startGiveaway', {adminId, items});
    }
}