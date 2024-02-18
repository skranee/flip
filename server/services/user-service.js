import userModel from "../models/user-model.js";
import axios from "axios";
import UserDto from "../dtos/user-dto.js";
import tokenService from "./token-service.js";
import ApiError from "../exceptions/api-error.js";
import historyModel from "../models/history-model.js";
import transactionModel from "../models/transaction-model.js";

class UserService {
    async getUser(username) {
        //getting user
        const userInfo = await axios.post('https://users.roblox.com/v1/usernames/users',{
            "usernames": [
                `${username}`
            ],
            "excludeBannedUsers": true
        });

        return userInfo;
    }

    async getUserBio(userId) {
        const userInfoResponse = await axios.get(`https://users.roblox.com/v1/users/${userId}`);

        const userBio = userInfoResponse.data.description;

        return userBio;
    }

    async getAvatar(userId) {
        const userInf = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=720x720&format=Png&isCircular=false`)

        const avatar = userInf.data.data[0].imageUrl;
        return avatar;
    }

    async saveToDB(userInfo) {
        const username = userInfo.name;
        const candidate = await userModel.findOne({username});
        if(candidate) {
            const user = candidate;
            const userDto = new UserDto(user);

            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto};
        } else {
            const avatar = await this.getAvatar(userInfo.id);
            const today = new Date();

            const month = today.toLocaleString('en-US', { month: 'long' });
            const day = today.getDate();
            const year = today.getFullYear();

            const formattedDate = `${month} ${day}, ${year}`;
            const user = await userModel.create({username: userInfo.name, regDate: formattedDate, robloxId: userInfo.id, avatar: avatar});
            const userDto = new UserDto(user);

            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
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

    async addItem(item, userId) {
        const update = await userModel.findOneAndUpdate({robloxId: userId}, {$push: {itemsList: item}});
        return update;
    }

    async addExp(id, exp) {
        const user = await userModel.findById(id);
        const currExp = user.experience;
        let newExp = currExp + exp;
        const level = Math.floor(newExp / process.env.MAX_EXP);
        newExp -= level * process.env.MAX_EXP;
        if((user.lvl % 5) + level >= 5) {
            const claim = await userModel.findByIdAndUpdate(id, {gotReward: false});
        }
        const update = await userModel.findByIdAndUpdate(id, {experience: newExp, $inc: {lvl: level}});
        return update;
    }

    async claim(id) {
        const claim = await userModel.findByIdAndUpdate(id, {gotReward: true});
        return claim;
    }

    async tip(from, to, amount) {
        const sender = await userModel.findOne({username: from});
        const receiver = await userModel.findOne({username: to});
        if(sender.balance < amount) {
            throw ApiError.BadRequest('Not enough balance!');
        } else if(!receiver) {
            throw ApiError.BadRequest('The receiver does not exist!');
        }
        const decrease = await userModel.findOneAndUpdate({username: from}, {$inc: {balance: -amount}});
        const increase = await userModel.findOneAndUpdate({username: to}, {$inc: {balance: amount}});
        return increase;
    }

    async getLeaders() {
        const users = await userModel.find();
        const leaders = users.sort((a, b) => b.totalWagered - a.totalWagered).slice(0, 20);
        return leaders;
    }

    async getHistory(userId) {
        const history = await historyModel.find({$or: [{player1: userId}, {player2: userId}]}).populate('player1').populate('player2');
        return history;
    }

    async getPayments(userId) {
        const payments = await transactionModel.find({user: userId});
        return payments;
    }
}

export default new UserService();