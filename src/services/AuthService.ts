import $api from "../http";
import {AxiosResponse} from "axios";
import {IUserInfo} from "../models/IUserInfo";
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async getUser(username: string): Promise<AxiosResponse<IUserInfo>> {
        return $api.post<IUserInfo>('/getUser', {username});
    }

    static async getBio(userId: number): Promise<AxiosResponse<string>> {
        return $api.get(`/getUserDescription?userId=${userId}`);
    }

    static async getUserAvatar(userId: number): Promise<AxiosResponse<string>> {
        return $api.get(`/getUserAvatar?userId=${userId}`);
    }

    static async saveToDb(user: IUserInfo): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/saveToDB', {user});
    }

    static async logout(): Promise<void> {
        return $api.post('/logout');
    }
}