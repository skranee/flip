import supportService from "../services/supportService.js";

class SupportController {
    async sendQuestion(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {message} = req.body;
            const send = await supportService.sendQuestion(message, refreshToken);
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
            const {refreshToken} = req.cookies;
            const answers = await supportService.getAnswers(refreshToken);
            return res.json(answers);
        } catch(e) {
            next(e);
        }
    }
}

export default new SupportController();