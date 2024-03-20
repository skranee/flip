import $api from "../http";
import {AxiosResponse} from "axios";
import {IUser} from "../models/IUser";

export default class AdminService {
    static async addReward(name: string, lvl: number, gemsAmount: number): Promise<AxiosResponse> {
        return $api.post('/reward', {name, lvl, gemsAmount});
    }

    static async changeRole(admin: string, username: string, role: string): Promise<AxiosResponse> {
        return $api.post('/changeRole', {admin, username, role});
    }

    static async addBalance(admin: string, username: string, value: number): Promise<AxiosResponse> {
        return $api.post('/addBalance', {admin, username, value});
    }

    static async reduceBalance(admin: string, username: string, value: number): Promise<AxiosResponse> {
        return $api.post('/reduceBalance', {admin, username, value});
    }

    static async changeLevel(admin: string, username: string, level: number): Promise<AxiosResponse> {
        return $api.post('/changeLevel', {admin, username, level});
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

    static async banUser(admin: string, username: string): Promise<AxiosResponse> {
        return $api.post('/banUser', {admin, username});
    }

    static async unbanUser(admin: string, username: string): Promise<AxiosResponse> {
        return $api.post('/unbanUser', {admin, username});
    }

    static async getFake(admin: string): Promise<AxiosResponse> {
        return $api.get(`/getFake?admin=${admin}`);
    }

    static async changeTaxReceiver(admin: string, receiverUsername: string, time: number): Promise<AxiosResponse> {
        return $api.post('/changeTaxPath', {admin, receiverUsername, time});
    }

    static async getReceiver(): Promise<AxiosResponse> {
        return $api.get('/receiver');
    }

    static async getTaxInfo(admin: string): Promise<AxiosResponse> {
        return $api.get(`/taxDataAdmin?admin=${admin}`);
    }

    static async cancelTaxChange(admin: string): Promise<AxiosResponse> {
        return $api.post('/cancelTaxChange', {admin});
    }
}