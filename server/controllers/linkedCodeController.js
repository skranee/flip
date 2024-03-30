import linkedCodeService from "../services/linkedCodeService.js";

class LinkedCodeController {
    async getLinkedCode(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const code = await linkedCodeService.getLinkedCode(refreshToken);
            return res.json(code);
        } catch(e) {
            next(e);
        }
    }

    async linkLinkedCode(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {code} = req.body;
            const link = await linkedCodeService.linkLinkedCode(code, refreshToken);
            return res.json(link);
        } catch(e) {
            next(e);
        }
    }
}

export default new LinkedCodeController();