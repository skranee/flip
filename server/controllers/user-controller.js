import userService from "../services/user-service.js";

class UserController {
    async getUser(req, res, next) {
        try {
            const {username} = req.body;

            const userInfo = await userService.getUser(username)

            if (!userInfo || !userInfo.description || !userInfo.user.data.data[0].id) {
                console.error('Error: Empty response from Roblox API - getUserId');
                return res.status(404).json({ error: 'User not found' });
            }

            const user = userInfo.user.data.data[0];
            const description = userInfo.description;
            return res.json({user, description})
        } catch (e) {
            next(e);
        }
    }

    async getUserAvatar(req, res, next) {
        try {
            const userId = req.query.userId;

            //getting user info about avatar
            const avatar = await userService.getAvatar(userId);

            return res.json(avatar)
        } catch (e) {
            next(e);
        }
    }

    async verifyDescription(req, res, next) {
        try {
            const {username} = req.body;
            const save = await userService.verifyDescription(username);
            if(save.match && save.match === 'failed') {
                return res.json(save);
            }
            res.cookie('refreshToken', save.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            return res.json({user: save.user, accessToken: save.accessToken});
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const save = await userService.refresh(refreshToken);
            res.cookie('refreshToken', save.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            return res.json({user: save.user, accessToken: save.accessToken});
        } catch (e) {
            next(e);
        }
    }

    async addExp(req, res, next) {
        try {
            const {id, exp} = req.body;
            const update = await userService.addExp(id, exp);
            return res.json(update);
        } catch(e) {
            next(e);
        }
    }

    async claim(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const claim = await userService.claim(refreshToken);
            return res.json(claim);
        } catch(e) {
            next(e);
        }
    }

    async tip(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {to, amount} = req.body;
            const send = await userService.tip(refreshToken, to, amount);
            return res.json(send);
        } catch(e) {
            next(e);
        }
    }

    async getLeaders(req, res, next) {
        try {
            const leaders = await userService.getLeaders();
            return res.json(leaders);
        } catch(e) {
            next(e);
        }
    }

    async getHistory(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const history = await userService.getHistory(refreshToken);
            return res.json(history);
        } catch (e) {
            next(e);
        }
    }

    async getPayments(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userId = req.query.userId;
            const payments = await userService.getPayments(userId, refreshToken);
            return res.json(payments);
        } catch(e) {
            next(e);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {message} = req.body;
            const send = await userService.sendMessage(message, refreshToken);
            return res.json(send);
        } catch(e) {
            next(e);
        }
    }
}

export default new UserController();