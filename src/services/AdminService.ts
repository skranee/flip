import $api from "../http";
import {AxiosResponse} from "axios";
import {IUser} from "../models/IUser";

export default class AdminService {
    static async addReward(image: string, name: string, lvl: number, description: string): Promise<AxiosResponse> {
        return $api.post('/reward', {image, name, lvl, description});
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

    static async banUser(admin: string, userId: string): Promise<AxiosResponse> {
        return $api.post('/banUser', {admin, userId});
    }

    static async unbanUser(admin: string, userId: string): Promise<AxiosResponse> {
        return $api.post('/unbanUser', {admin, userId});
    }
}