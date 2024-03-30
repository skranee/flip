import $api from "../http";
import {AxiosResponse} from "axios";
import ILinkedCode from "../models/ILinkedCode";

export default class LinkedCodeService {
    static async getLinkedCode(): Promise<AxiosResponse<ILinkedCode>> {
        return $api.get(`/linkedCode`);
    }

    static async linkLinkedCode(code: string): Promise<AxiosResponse> {
        return $api.post('/linkedCode', {code});
    }
}