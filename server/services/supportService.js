import supportModel from "../models/support-model.js";
import tokenService from "./token-service.js";
import ApiError from "../exceptions/api-error.js";

class SupportService {
    async sendQuestion(message, refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
        const send = await supportModel.create({message: message, userId: userId});
        return send;
    }

    async getQuestions() {
        const questions = await supportModel.find().populate('userId');
        return questions;
    }

    async answer(id, mes) {
        const answer = await supportModel.findOneAndUpdate({_id: id}, {answered: true, answer: mes});
        return answer;
    }

    async getAnswers(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
        const answersAll = await supportModel.find({userId: userId});
        const answers = answersAll.filter(item => item.answered === true)
        return answers;
    }
}

export default new SupportService();