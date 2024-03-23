import adminService from "../services/adminService.js";

class AdminController {
    async changeRole(req, res, next) {
        try {
            const {admin, username, role} = req.body;
            const change = await adminService.changeRole(admin, username, role);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async addBalance(req, res, next) {
        try {
            const {key, admin, username, value} = req.body;
            const change = await adminService.addBalance(key, admin, username, value);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async reduceBalance(req, res, next) {
        try {
            const {key, admin, username, value} = req.body;
            const change = await adminService.reduceBalance(key, admin, username, value);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async changeLevel(req, res, next) {
        try {
             const {admin, username, level} = req.body;
             const change = await adminService.changeLevel(admin, username, level);
             return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async increaseOnline(req, res, next) {
        try {
            const {change} = req.body;
            const increase = await adminService.increaseOnline(change);
            return res.json(increase);
        } catch(e) {
            next(e);
        }
    }

    async decreaseOnline(req, res, next) {
        try {
            const {change} = req.body;
            const decrease = await adminService.decreaseOnline(change);
            return res.json(decrease);
        } catch(e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const username = req.query.username;
            const user = await adminService.getUser(username);
            return res.json(user);
        } catch(e) {
            next(e);
        }
    }

    async banUser(req, res, next) {
        try {
            const {admin, username} = req.body;
            const ban = await adminService.banUser(admin, username);
            return res.json(ban);
        } catch(e) {
            next(e);
        }
    }

    async unbanUser(req, res, next) {
        try {
            const {admin, username} = req.body;
            const unban = await adminService.unbanUser(admin, username);
            return res.json(unban);
        } catch(e) {
            next(e);
        }
    }

    async getFake(req, res, next) {
        try {
            const admin = req.query.admin;
            const fake = await adminService.getFake(admin);
            return res.json(fake);
        } catch(e) {
            next(e);
        }
    }

    async changeTaxReceiver(req, res, next) {
        try {
            const {key, admin, receiverUsername, time} = req.body;
            const change = await adminService.changeTaxReceiver(key, admin, receiverUsername, time);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async getReceiver(req, res, next) {
        try {
            const receiver = await adminService.getReceiver();
            return res.json(receiver);
        } catch(e) {
            next(e);
        }
    }

    async getTaxInfo(req, res, next) {
        try {
            const admin = req.query.admin;
            const data = await adminService.getTaxInfo(admin);
            return res.json(data);
        } catch(e) {
            next(e);
        }
    }

    async cancelTaxChange(req, res, next) {
        try {
            const {admin} = req.body;
            const cancel = await adminService.cancelTaxChange(admin);
            return res.json(cancel);
        } catch(e) {
            next(e);
        }
    }
}

export default new AdminController();