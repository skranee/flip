import userModel from "../models/user-model.js";
import axios from "axios";
import UserDto from "../dtos/user-dto.js";
import tokenService from "./token-service.js";
import ApiError from "../exceptions/api-error.js";

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
        const userInf = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=false`)

        const avatar = userInf.data.data[0].imageUrl;
        return avatar;
    }

    async saveToDB(userInfo) {
        console.log(userInfo)
        const username = userInfo.name;
        const candidate = await userModel.findOne({username});
        if(candidate) {
            const user = candidate;
            const userDto = new UserDto(user);

            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto};
        } else {
            const user = await userModel.create({username: userInfo.name});
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
}

export default new UserService();