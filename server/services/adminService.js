import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";
import {handleOnline} from "../websocket.js";

class AdminService {
    async changeRole(admin, username, role) {
        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        const change = await userModel.updateOne({username: username}, {role: role});
        return change;
    }

    async addBalance(admin, username, value) {
        const candidate = await userModel.findOne({_id: admin});
        if(!candidate || candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        const add = await userModel.updateOne({username: username}, {$inc: {balance: value}});
        return add;
    }

    async reduceBalance(admin, username, value) {
        const candidate = await userModel.findOne({_id: admin});
        if(!candidate || candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        const add = await userModel.updateOne({username: username}, {$inc: {balance: -value}});
        return add;
    }

    async changeLevel(admin, username, level) {
        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        if(level >= 100000) {
            return ApiError.BadRequest('Level must not be more than 99999');
        }
        const change = await userModel.updateOne({username: username}, {lvl: level});
        return change;
    }

    async increaseOnline(inc) {
        handleOnline(inc);
        return null;
    }

    async decreaseOnline(dec) {
        handleOnline(-dec);
        return null;
    }

    async getUser(username) {
        const user = await userModel.findOne({username: username});
        return user;
    }

    async banUser(admin, userId) {
        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        } else {
            const ban = await userModel.updateOne({_id: userId}, {banned: true});
            return ban;
        }
    }

    async unbanUser(admin, userId) {
        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        } else {
            const unban = await userModel.updateOne({_id: userId}, {banned: false});
            return unban;
        }
    }
}

export default new AdminService();