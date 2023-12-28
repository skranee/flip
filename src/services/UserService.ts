import $api from "../http";
import {AxiosResponse} from "axios";
import {IItem} from "../models/IItem";
import {RewardResponse} from "../models/response/RewardResponse";
import {IUser} from "../models/IUser";


export default class UserService {
    static async addItem(item: IItem, userId: string): Promise<AxiosResponse> {
        return $api.put('/addItem', {item, userId});
    }

    static async getReward(lvl: number): Promise<AxiosResponse<RewardResponse>> {
        return $api.post(`/getReward`, {lvl});
    }

    static async addExp(id: string, exp: number): Promise<AxiosResponse> {
        return $api.put('/boost',{id, exp});
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
}