import $api from "../http";
import {AxiosResponse} from "axios";

export default class DepositService {
    static async createPaymentAddress(currency: string, user: string): Promise<AxiosResponse<string>> {
        const key = '018e6d4f-df28-70b7-8fca-cea7b5258b06';
        return $api.post('/paymentAddress', {key, currency, user});
    }

    static async findAddress(user: string, currency: string): Promise<AxiosResponse<string | null>> {
        return $api.post('/findAddress', {user, currency});
    }
}