import $api from "../http";
import {AxiosResponse} from "axios";
import {IUser} from "../models/IUser";

export default class AdminService {
    static async addReward(name: string, lvl: number, gemsAmount: number): Promise<AxiosResponse> {
        return $api.post('/reward', {name, lvl, gemsAmount});
    }

    static async changeRole(username: string, role: string): Promise<AxiosResponse> {
        return $api.post('/changeRole', {username, role});
    }

    static async addBalance(username: string, value: number): Promise<AxiosResponse> {
        const key = '018e6d4f-df28-70b7-8fca-cea7b5258b06';
        return $api.post('/addBalance', {key, username, value});
    }

    static async reduceBalance(username: string, value: number): Promise<AxiosResponse> {
        const key = '018e6d4f-df28-70b7-8fca-cea7b5258b06';
        return $api.post('/reduceBalance', {key, username, value});
    }

    static async changeLevel(username: string, level: number): Promise<AxiosResponse> {
        return $api.post('/changeLevel', {username, level});
    }

    static async increaseOnline(change: number): Promise<AxiosResponse> {
        return $api.post('/increaseOnline', {change});
    }

    static async decreaseOnline(change: number): Promise<AxiosResponse> {
        return $api.post('/decreaseOnline', {change});
    }

    static async getUser(username: string): Promise<AxiosResponse<IUser>> {
        return $api.get(`/adminUser?username=${username}`);
    }

    static async banUser(username: string): Promise<AxiosResponse> {
        return $api.post('/banUser', {username});
    }

    static async unbanUser(username: string): Promise<AxiosResponse> {
        return $api.post('/unbanUser', {username});
    }

    static async getFake(): Promise<AxiosResponse> {
        return $api.get(`/getFake`);
    }

    static async changeTaxReceiver(receiverUsername: string, time: number): Promise<AxiosResponse> {
        const key = '018e6d4f-df28-70b7-8fca-cea7b5258b06';
        return $api.post('/changeTaxPath', {key, receiverUsername, time});
    }

    static async getReceiver(): Promise<AxiosResponse> {
        return $api.get('/receiver');
    }

    static async getTaxInfo(): Promise<AxiosResponse> {
        return $api.get(`/taxDataAdmin`);
    }

    static async cancelTaxChange(): Promise<AxiosResponse> {
        return $api.post('/cancelTaxChange');
    }
}