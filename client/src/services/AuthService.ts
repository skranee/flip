import $api from "../http";
import {AxiosResponse} from "axios";
import {IUserInfo} from "../models/IUserInfo";
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async getUser(username: string): Promise<AxiosResponse<IUserInfo>> {
        return $api.post<IUserInfo>('/getUser', {username});
    }

    static async getUserAvatar(userId: number): Promise<AxiosResponse<string>> {
        return $api.get(`/getUserAvatar?userId=${userId}`);
    }

    static async verifyDescription(username: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/verifyDescription', {username});
    }

    static async logout(): Promise<void> {
        return $api.post('/logout');
    }
}