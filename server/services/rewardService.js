import rewardModel from "../models/reward-model.js";
import ApiError from "../exceptions/api-error.js";

class RewardService {
    async addReward(name, lvl, gemsAmount) {
        const candidate = await rewardModel.findOne({lvl: lvl});
        if(candidate) {
            throw ApiError.BadRequest('This bonus already exists');
        }
        const create = await rewardModel.create({name: name, lvl: lvl, gemsAmount: gemsAmount});
        return create;
    }

    async getReward(level) {
        const reward = await rewardModel.findOne({lvl: level});
        return reward;
    }
}

export default new RewardService();