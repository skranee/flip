import $api from "../http";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import {WithdrawResponse} from "../models/response/WithdrawResponse";

export default class BotService {
    static async decideWhichBot(items: IItem[]): Promise<AxiosResponse> {
        return $api.post('/decideWhichBot', {items});
    }

    static async completeWithdraw(robloxId: string): Promise<AxiosResponse> {
        return $api.post('/completeWithdraw', {robloxId});
    }

    static async addItemBot(robloxId: string, item: IItem): Promise<AxiosResponse> {
        return $api.post('/bot', {robloxId, item});
    }

    static async getWithdrawData(): Promise<AxiosResponse<WithdrawResponse>> {
        return $api.get(`/withdraw`);
    }

    static async getUserItems(userId: string): Promise<AxiosResponse<IItem[]>> {
        return $api.get(`/getUserItems?userId=${userId}`);
    }
}