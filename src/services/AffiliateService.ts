import $api from "../http";
import {AxiosResponse} from "axios";
import {IAffiliate} from "../models/IAffiliate";

export default class AffiliateService {
    static async createAffiliate(code: string, userId: string): Promise<AxiosResponse> {
        return $api.post('/createAffiliate', {code, userId});
    }

    static async getBalance(userId: string): Promise<AxiosResponse> {
        return $api.patch('/affiliateBalance', {userId});
    }

    static async getAffiliate(userId: string): Promise<AxiosResponse<IAffiliate>> {
        return $api.get(`/getAffiliate?userId=${userId}`);
    }

    static async checkForCode(code: string): Promise<AxiosResponse> {
        return $api.get(`/code?code=${code}`);
    }

    static async linkCode(code: string): Promise<AxiosResponse> {
        return $api.patch('/code', {code});
    }

    static async codeUse(code: string, payment: number): Promise<AxiosResponse> {
        return $api.post('/code', {code, payment});
    }

    static async unlinkCode(code: string): Promise<AxiosResponse> {
        return $api.post('/unlinkCode', {code});
    }
}