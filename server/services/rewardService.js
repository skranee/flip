import rewardModel from "../models/reward-model.js";
import ApiError from "../exceptions/api-error.js";

class RewardService {
    async addReward(image, name, lvl, description) {
        const candidate = await rewardModel.findOne({lvl: lvl});
        if(candidate) {
            throw ApiError.BadRequest('This bonus already exists');
        }
        const reward = await rewardModel.create({image: image, name: name, lvl: lvl, description: description});
        return reward;
    }

    async getReward(level) {
        const reward = await rewardModel.findOne({lvl: level});
        return reward;
    }
}

export default new RewardService();