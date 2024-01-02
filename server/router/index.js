import {Router} from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import AffiliateController from "../controllers/affiliateController.js";
import RewardController from "../controllers/rewardController.js";
import gameController from "../controllers/gameController.js";
import supportController from "../controllers/supportController.js";

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
router.patch('/tip', userController.tip);
router.get('/leaders', userController.getLeaders);
router.post('/game', gameController.createGame);
router.get('/game', gameController.getGames);
router.post('/endGame', gameController.deleteGame);
router.get('/history', userController.getHistory);
router.post('/history', userController.addHistory);
router.post('/support', supportController.sendQuestion);
router.get('/support', supportController.getQuestions);
router.put('/support', supportController.answer);
router.get('/answers', supportController.getAnswers)

export default router;