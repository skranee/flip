import $api from "../http";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import {WithdrawResponse} from "../models/response/WithdrawResponse";

export default class BotService {
    static async getWithdrawData(): Promise<AxiosResponse<WithdrawResponse>> {
        return $api.get(`/withdraw`);
    }

    static async getUserItems(userId: string): Promise<AxiosResponse<IItem[]>> {
        return $api.get(`/getUserItems?userId=${userId}`);
    }

    static async getGiveawayItems(adminId: string): Promise<AxiosResponse<IItem[]>> {
        return $api.get(`/giveawayItems?adminId=${adminId}`);
    }

    static async startGiveaway(adminId: string, items: IItem[]): Promise<AxiosResponse<IItem[]>> {
        return $api.post('/startGiveaway', {adminId, items});
    }
}