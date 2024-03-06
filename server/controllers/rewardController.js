import rewardService from "../services/rewardService.js";

class RewardController {
    async addReward(req, res, next) {
        try {
            const {name, lvl, gemsAmount} = req.body;
            const reward = await rewardService.addReward(name, lvl, gemsAmount);
            return res.json(reward)
        } catch(e) {
            next(e);
        }
    }

    async getReward(req, res, next) {
        try {
            const {lvl} = req.body;
            const reward = await rewardService.getReward(lvl);
            return res.json(reward);
        } catch(e) {
            next(e);
        }
    }
}

export default new RewardController();