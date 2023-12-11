import axios from "axios";
import userService from "../services/user-service.js";
import tokenService from "../services/token-service.js";

class UserController {
    async getUser(req, res, next) {
        try {
            const {username} = req.body;

            const userInfo = await userService.getUser(username)

            if (!userInfo.data|| !userInfo.data.data[0].id) {
                console.error('Error: Empty response from Roblox API - getUserId');
                return res.status(404).json({ error: 'User not found' });
            }

            const user = userInfo.data.data[0];
            return res.json({user})
        } catch (e) {
            next(e);
        }
    }

    async getUserDescription(req, res, next) {
        try {
            const userId = req.query.userId;

            //getting user description
            const description = await userService.getUserBio(userId);

            res.json(description);
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

    async saveToDB(req, res, next) {
        try {
            const {user} = req.body;
            console.log(user)
            const save = await userService.saveToDB(user);
            res.cookie('refreshToken', save.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            return res.json(save);
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
            return res.json(save);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();