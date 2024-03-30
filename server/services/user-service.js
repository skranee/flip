import userModel from "../models/user-model.js";
import axios from "axios";
import UserDto from "../dtos/user-dto.js";
import tokenService from "./token-service.js";
import ApiError from "../exceptions/api-error.js";
import historyModel from "../models/history-model.js";
import transactionModel from "../models/transaction-model.js";
import rewardModel from "../models/reward-model.js";
import {sendMessage} from "../websocket.js";
import loginModel from "../models/login-model.js";
import {Schema} from "mongoose";

class UserService {
    async getUser(username) {
        const userInfo = await axios.post('https://users.roblox.com/v1/usernames/users',{
            "usernames": [
                `${username}`
            ],
            "excludeBannedUsers": true
        });

        const randomWords = ['penguin', 'living', 'seaside', 'funny', 'fish', 'fresh', 'jumping', 'famous', 'smiling', 'wave', 'hat', 'city', 'hills', 'beautiful', 'friendly', 'dog', 'water', 'dance', 'light', 'lion']

        const generateRandom = () => {
            let randomString = '';
            let randomNumber = (Math.round(Math.random() * 1000) % 3) + (Math.round(Math.random() * 1000) % 4) + 9;
            for(let i = 0; i < randomNumber; ++i) {
                const wordNumber = Math.round(Math.random() * 1000) % randomWords.length;
                randomString += randomWords[wordNumber];
                if(i !== randomNumber - 1) {
                    randomString += ' ';
                }
            }
            return randomString;
        }

        const candidate = await loginModel.findOne({username: username});
        if(candidate) {
            return {
                user: userInfo,
                description: candidate.description
            }
        }

        const description = generateRandom();
        if(userInfo && userInfo.data.data[0]) {
            await loginModel.create({
                username: userInfo.data.data[0].name,
                description: description,
                userId: userInfo.data.data[0].id
            });
        }

        return {
            user: userInfo,
            description: description
        };
    }

    async getUserBio(userId) {
        const userInfoResponse = await axios.get(`https://users.roblox.com/v1/users/${userId}`);

        return userInfoResponse.data.description;
    }

    async getAvatar(userId) {
        const userInf = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=720x720&format=Png&isCircular=false`)

        const avatar = userInf.data.data[0].imageUrl;
        return avatar;
    }

    async verifyDescription(username) {
        const userLogin = await loginModel.findOne({username: username});
        if(!userLogin) {
            return ApiError.BadRequest('No such login sessions');
        }
        const relevantBio = await this.getUserBio(userLogin.userId);
        if(relevantBio) {
            if(relevantBio === userLogin.description) { //change here to right equation
                await loginModel.deleteOne({username: username});
                return {match: 'failed'};
            }
        }
        const candidate = await userModel.findOne({username: userLogin.username});
        if(candidate) {
            const user = candidate;
            const userDto = new UserDto(user);

            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            await loginModel.deleteOne({username: username});
            return {...tokens, user: userDto};
        } else {
            const avatar = await this.getAvatar(userLogin.userId);
            const today = new Date();

            const month = today.toLocaleString('en-US', { month: 'long' });
            const day = today.getDate();
            const year = today.getFullYear();

            const formattedDate = `${month} ${day}, ${year}`;
            const user = await userModel.create({username: userLogin.username, regDate: formattedDate, robloxId: userLogin.userId, avatar: avatar});
            const userDto = new UserDto(user);

            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            await loginModel.deleteOne({username: username});
            return {...tokens, user: userDto};
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async addExp(id, exp) {
        const user = await userModel.findById(id);
        const currExp = user.experience;
        let newExp = currExp + exp;
        const level = Math.floor(newExp / process.env.MAX_EXP);
        newExp -= level * process.env.MAX_EXP;
        if((user.lvl % 5) + level >= 5) {
            const claim = await userModel.updateOne({_id: id}, {gotReward: false});
        }
        const update = await userModel.updateOne({_id: id}, {experience: newExp, $inc: {lvl: level}});
        return update;
    }

    async claim(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const id = tokenData.user;

        await userModel.updateOne({_id: id}, {gotReward: true});
        const user = await userModel.findOne({_id: id});
        const lvl = user.lvl;
        const reward = await rewardModel.findOne({lvl: lvl});
        await userModel.updateOne({_id: id}, {$inc: {balance: reward.gemsAmount}});
        return 'success';
    }

    async tip(refreshToken, to, amount) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }

        const userId = tokenData.user;
        const user = await userModel.findOne({_id: userId});
        if(!user) {
            return ApiError.BadRequest('Unexpected error');
        }

        const from = user.username;
        const sender = await userModel.findOne({username: from});
        const receiver = await userModel.findOne({username: to});

        if(sender && sender.balance < amount) {
            return ApiError.BadRequest('Not enough balance!');
        } else if(!receiver) {
            return ApiError.BadRequest('The receiver does not exist!');
        }

        await userModel.updateOne({username: from}, {$inc: {balance: -amount}});
        await userModel.updateOne({username: to}, {$inc: {balance: amount}});

        return 'success';
    }

    async getLeaders() {
        const users = await userModel.find();
        const leaders = users.sort((a, b) => b.totalWagered - a.totalWagered).slice(0, 15);
        return leaders.map(leader => ({
            username: leader.username,
            avatar: leader.avatar,
            totalWagered: leader.totalWagered,
            gamesPlayed: leader.gamesPlayed,
            lvl: leader.lvl
        }));
    }

    async getHistory(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user;
        const history = await historyModel.find({$or: [{player1: userId}, {player2: userId}]}).
        populate('player1', 'avatar').
        populate('player2', 'avatar');
        return history;
    }

    async getPayments(userId, refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const id = tokenData.user.toString();

        const user = await userModel.findOne({_id: id});

        if(id !== userId && (!user || user.role !== 'admin')) {
            return ApiError.BadRequest('Not allowed!');
        }

        const payments = await transactionModel.find({user: userId});
        return payments;
    }

    async sendMessage(mes, refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const userId = tokenData.user.toString();
        const user = await userModel.findOne({_id: userId});
        if(!user) {
            return ApiError.BadRequest('Not allowed');
        }

        const fullMessage = {
            message: mes.message,
            id: mes.id,
            time: mes.time,
            user: user,
            avatar: user.avatar,
            method: mes.method
        }

        sendMessage(fullMessage);
        return null;
    }
}

export default new UserService();