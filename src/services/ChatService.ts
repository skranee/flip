import $api from "../http";
import {IUser} from "../models/IUser";
import {AxiosResponse} from "axios";
import IMessage from "../models/IMessage";

export default class ChatService {
    static async sendMessage(user: IUser, message: string, time: string, id: string, avatar: string): Promise<AxiosResponse<IMessage[]>> {
        return $api.post('/message', {user, message, time, id, avatar});
    }

    static async getMessages(): Promise<AxiosResponse<IMessage[]>> {
        return $api.get('/message');
    }
}