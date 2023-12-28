import $api from "../http";
import {AxiosResponse} from "axios";
import {IUser} from "../models/IUser";
import {IAffiliate} from "../models/IAffiliate";

export default class AffiliateService {
    static async createAffiliate(code: string, userId: string): Promise<AxiosResponse> {
        return $api.post('/createAffiliate', {code, userId});
    }

    static async getAffiliate(userId: string): Promise<AxiosResponse<IAffiliate>> {
        return $api.get(`/getAffiliate?userId=${userId}`);
    }
}