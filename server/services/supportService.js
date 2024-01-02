import supportModel from "../models/support-model.js";

class SupportService {
    async sendQuestion(message, userId) {
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

    async getAnswers(userId) {
        const answersAll = await supportModel.find({userId: userId});
        const answers = answersAll.filter(item => item.answered === true)
        return answers;
    }
}

export default new SupportService();