import rewardModel from "../models/reward-model.js";
import ApiError from "../exceptions/api-error.js";
import tokenService from "./token-service.js";
import userModel from "../models/user-model.js";

class RewardService {
    async addReward(name, lvl, gemsAmount) {
        const candidate = await rewardModel.findOne({lvl: lvl});
        if(candidate) {
            throw ApiError.BadRequest('This bonus already exists');
        }
        const create = await rewardModel.create({name: name, lvl: lvl, gemsAmount: gemsAmount});
        return create;
    }

    async getReward(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const user = await userModel.findOne({_id: tokenData.user});
        if(!user) {
            return ApiError.BadRequest('Unexpected error');
        }
        const lvl = user.lvl;
        const level = Math.ceil((lvl + 1) / 5) * 5;
        const reward = await rewardModel.findOne({lvl: level});
        return reward;
    }
}

export default new RewardService();