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
            const {admin, username, value} = req.body;
            const change = await adminService.addBalance(admin, username, value);
            return res.json(change);
        } catch(e) {
            next(e);
        }
    }

    async reduceBalance(req, res, next) {
        try {
            const {admin, username, value} = req.body;
            const change = await adminService.reduceBalance(admin, username, value);
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
}

export default new AdminController();