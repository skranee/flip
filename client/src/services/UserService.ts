import $api from "../http";
import {AxiosResponse} from "axios";
import {IItem} from "../models/IItem";
import {RewardResponse} from "../models/response/RewardResponse";
import {IUser} from "../models/IUser";
import IHistory from "../models/IHistory";
import IPayment from "../models/IPayment";


export default class UserService {
    static async getReward(): Promise<AxiosResponse<RewardResponse>> {
        return $api.post(`/getReward`);
    }

    static async claim(): Promise<AxiosResponse> {
        return $api.put('/claim');
    }

    static async tip(to: string, amount: number): Promise<AxiosResponse> {
        return $api.patch('/tip', {to, amount});
    }

    static async getLeaders(): Promise<AxiosResponse<IUser[]>> {
        return $api.get('/leaders');
    }

    static async getHistory(): Promise<AxiosResponse<IHistory[]>> {
        return $api.get(`/history`)
    }

    static async getPayments(userId: string): Promise<AxiosResponse<IPayment[]>> {
        return $api.get(`/payments?userId=${userId}`);
    }

    static async get24hours(): Promise<AxiosResponse> {
        return $api.get('/24hours');
    }

    static async sendMessage(message: object): Promise<AxiosResponse> {
        return $api.post('/sendMessage', {message});
    }
}