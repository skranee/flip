import adminService from "../services/adminService.js";

class AdminController {
    async changeRole(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {username, role} = req.body;
            const change = await adminService.changeRole(refreshToken, username, role);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async addBalance(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {key, username, value} = req.body;
            const change = await adminService.addBalance(key, refreshToken, username, value);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async reduceBalance(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {key, username, value} = req.body;
            const change = await adminService.reduceBalance(key, refreshToken, username, value);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async changeLevel(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
             const {username, level} = req.body;
             const change = await adminService.changeLevel(refreshToken, username, level);
             return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async increaseOnline(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {change} = req.body;
            const increase = await adminService.increaseOnline(change, refreshToken);
            return res.json(increase);
        } catch(e) {
            next(e);
        }
    }

    async decreaseOnline(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {change} = req.body;
            const decrease = await adminService.decreaseOnline(change, refreshToken);
            return res.json(decrease);
        } catch(e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const username = req.query.username;
            const user = await adminService.getUser(username, refreshToken);
            return res.json(user);
        } catch(e) {
            next(e);
        }
    }

    async banUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {username} = req.body;
            const ban = await adminService.banUser(refreshToken, username);
            return res.json(ban);
        } catch(e) {
            next(e);
        }
    }

    async unbanUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {username} = req.body;
            const unban = await adminService.unbanUser(refreshToken, username);
            return res.json(unban);
        } catch(e) {
            next(e);
        }
    }

    async getFake(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const fake = await adminService.getFake(refreshToken);
            return res.json(fake);
        } catch(e) {
            next(e);
        }
    }

    async changeTaxReceiver(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {key, receiverUsername, time} = req.body;
            const change = await adminService.changeTaxReceiver(key, refreshToken, receiverUsername, time);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async getReceiver(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const receiver = await adminService.getReceiver(refreshToken);
            return res.json(receiver);
        } catch(e) {
            next(e);
        }
    }

    async getTaxInfo(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const data = await adminService.getTaxInfo(refreshToken);
            return res.json(data);
        } catch(e) {
            next(e);
        }
    }

    async cancelTaxChange(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const cancel = await adminService.cancelTaxChange(refreshToken);
            return res.json(cancel);
        } catch(e) {
            next(e);
        }
    }
}

export default new AdminController();