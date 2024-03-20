import $api from "../http";
import {AxiosResponse} from "axios";
import ILinkedCode from "../models/ILinkedCode";

export default class LinkedCodeService {
    static async getLinkedCode(userId: string): Promise<AxiosResponse<ILinkedCode>> {
        return $api.get(`/linkedCode?userId=${userId}`);
    }

    static async linkLinkedCode(code: string, userId: string): Promise<AxiosResponse> {
        return $api.post('/linkedCode', {code, userId});
    }
}