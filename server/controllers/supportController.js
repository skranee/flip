import supportService from "../services/supportService.js";

class SupportController {
    async sendQuestion(req, res, next) {
        try {
            const {message, userId} = req.body;
            const send = await supportService.sendQuestion(message, userId);
            return res.json(send);
        } catch(e) {
            next(e);
        }
    }

    async getQuestions(req, res, next) {
        try {
            const questions = await supportService.getQuestions();
            return res.json(questions);
        } catch(e) {
            next(e);
        }
    }

    async answer(req, res, next) {
        try {
            const {id, mes} = req.body;
            const answer = await supportService.answer(id, mes);
            return res.json(answer);
        } catch(e) {
            next(e);
        }
    }

    async getAnswers(req, res, next) {
        try {
            const userId = req.query.userId;
            const answers = await supportService.getAnswers(userId);
            return res.json(answers);
        } catch(e) {
            next(e);
        }
    }
}

export default new SupportController();