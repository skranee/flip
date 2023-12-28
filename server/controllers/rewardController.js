import rewardService from "../services/rewardService.js";

class RewardController {
    async addReward(req, res, next) {
        try {
            const {image, name, lvl, description} = req.body;
            const reward = await rewardService.addReward(image, name, lvl, description);
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