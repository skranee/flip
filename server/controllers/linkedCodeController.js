import linkedCodeService from "../services/linkedCodeService.js";

class LinkedCodeController {
    async getLinkedCode(req, res, next) {
        try {
            const userId = req.query.userId;
            const code = await linkedCodeService.getLinkedCode(userId);
            return res.json(code);
        } catch(e) {
            next(e);
        }
    }

    async linkLinkedCode(req, res, next) {
        try {
            const {userId, code} = req.body;
            const link = await linkedCodeService.linkLinkedCode(code, userId);
            return res.json(link);
        } catch(e) {
            next(e);
        }
    }
}

export default new LinkedCodeController();