import $api from "../http";
import {AxiosResponse} from "axios";

export default class AdminService {
    static async addReward(image: string, name: string, lvl: number, description: string): Promise<AxiosResponse> {
        return $api.post('/reward', {image, name, lvl, description});
    }
}