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
            console.error('Error in getUserInfo endpoint:', e.response?.data || e.message);
            res.status(500).json({ error: 'Internal Server Error - getUserInfo' });
        }
    }

    async getUserDescription(req, res, next) {
        try {
            const userId = req.query.userId;

            //getting user description
            const description = await userService.getUserBio(userId);

            res.json(description);
        } catch (e) {
            console.error('Error in getUserDescription endpoint:', e.response?.data || e.message);
            res.status(500).json({ error: 'Internal Server Error - getUserDescription' });
        }
    }

    async getUserAvatar(req, res, next) {
        try {
            const userId = req.query.userId;

            //getting user info about avatar
            const avatar = await userService.getAvatar(userId);

            return res.json(avatar)
        } catch (error) {
            console.error('Error in getUserAvatar endpoint:', error.response?.data || error.message);
            res.status(500).json({ error: 'Internal Server Error - getUserAvatar' });
        }
    }

    async saveToDB(req, res, next) {
        try {
            const {userInfo} = req.body;
            const save = await userService.saveToDB(userInfo);
            res.cookie('refreshToken', save.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            return res.json(save);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {

        }
    }
}

export default new UserController();