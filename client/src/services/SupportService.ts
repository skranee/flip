import $api from "../http";
import {AxiosResponse} from "axios";
import ISupport from "../models/ISupport";
import {SupportResponse} from "../models/response/SupportResponse";

export default class SupportService {
    static async sendQuestion(message: string): Promise <AxiosResponse> {
        return $api.post('/support', {message});
    }

    static async getQuestions(): Promise <AxiosResponse<ISupport[]>> {
        return $api.get('/support');
    }

    static async answer(id: string, mes: string): Promise <AxiosResponse> {
        return $api.put('/support', {id, mes});
    }

    static async getAnswers(): Promise <AxiosResponse<SupportResponse[]>> {
        return $api.get(`/answers`);
    }
}