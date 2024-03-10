import $api from "../http";
import {AxiosResponse} from "axios";
import {IItem} from "../models/IItem";
import {RewardResponse} from "../models/response/RewardResponse";
import {IUser} from "../models/IUser";
import IHistory from "../models/IHistory";
import IPayment from "../models/IPayment";


export default class UserService {
    static async addItem(item: IItem, userId: string): Promise<AxiosResponse> {
        return $api.put('/addItem', {item, userId});
    }

    static async getReward(lvl: number): Promise<AxiosResponse<RewardResponse>> {
        return $api.post(`/getReward`, {lvl});
    }

    static async claim(id: string): Promise<AxiosResponse> {
        return $api.put('/claim', {id});
    }

    static async tip(from: string, to: string, amount: number): Promise<AxiosResponse> {
        return $api.patch('/tip', {from, to, amount});
    }

    static async getLeaders(): Promise<AxiosResponse<IUser[]>> {
        return $api.get('/leaders');
    }

    static async getHistory(userId: string): Promise<AxiosResponse<IHistory[]>> {
        return $api.get(`/history?userId=${userId}`)
    }

    static async getPayments(userId: string): Promise<AxiosResponse<IPayment[]>> {
        return $api.get(`/payments?userId=${userId}`);
    }

    static async get24hours(): Promise<AxiosResponse> {
        return $api.get('/24hours');
    }
}