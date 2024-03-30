import $api from "../http";
import {AxiosResponse} from "axios";

export default class DepositService {
    static async createPaymentAddress(currency: string): Promise<AxiosResponse<string>> {
        return $api.post('/paymentAddress', {currency});
    }

    static async findAddress(currency: string): Promise<AxiosResponse<string | null>> {
        return $api.post('/findAddress', {currency});
    }
}