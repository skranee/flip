import {Router} from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import AffiliateController from "../controllers/affiliateController.js";
import RewardController from "../controllers/rewardController.js";

const router = new Router();

router.post('/getUser', userController.getUser);
router.get('/getUserDescription', userController.getUserDescription);
router.get('/getUserAvatar', userController.getUserAvatar);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.post('/saveToDB', userController.saveToDB);
router.put('/addItem', userController.addItem);
router.post('/createAffiliate', AffiliateController.createAffiliate);
router.get('/getAffiliate', AffiliateController.getAffiliate);
router.post('/reward', RewardController.addReward);
router.post('/getReward', RewardController.getReward);
router.put('/boost', userController.addExp);
router.put('/claim', userController.claim);
router.patch('/tip', userController.tip)
router.get('/leaders', userController.getLeaders)

export default router;