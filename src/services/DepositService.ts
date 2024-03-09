import $api from "../http";
import {AxiosResponse} from "axios";

export default class DepositService {
    static async createPaymentAddress(currency: string, user: string): Promise<AxiosResponse<string>> {
        return $api.post('/paymentAddress', {currency, user});
    }

    static async findAddress(user: string, currency: string): Promise<AxiosResponse<string | null>> {
        return $api.post('/findAddress', {user, currency});
    }
}