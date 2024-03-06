import $api from "../http";
import {AxiosResponse} from "axios";
import BotEntityResponse from "../models/response/BotEntityResponse";

export default class BotEntityService {
    static async getBots(): Promise<AxiosResponse<BotEntityResponse>> {
        return $api.get('/botEntity');
    }

    static async addBot(serverUrl: string, name: string, avatar: string, robloxId: string): Promise<AxiosResponse<BotEntityResponse>> {
        return $api.post('/botEntity', {serverUrl, name, avatar, robloxId});
    }
}