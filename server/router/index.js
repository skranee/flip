import {Router} from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import AffiliateController from "../controllers/affiliateController.js";
import RewardController from "../controllers/rewardController.js";
import gameController from "../controllers/gameController.js";
import supportController from "../controllers/supportController.js";
import marketController from "../controllers/marketController.js";
import botController from "../controllers/botController.js";
import historyController from "../controllers/historyController.js";
import depositController from "../controllers/depositController.js";
import adminController from "../controllers/adminController.js";
import itemController from "../controllers/itemController.js";
import withdrawController from "../controllers/withdrawController.js";
import depositService from "../services/depositService.js";
import chatController from "../controllers/chat-controller.js";
import linkedCodeController from "../controllers/linkedCodeController.js";

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
router.patch('/affiliateBalance', AffiliateController.getBalance);
router.get('/code', AffiliateController.checkForCode);
router.patch('/code', AffiliateController.linkCode);
router.post('/code', AffiliateController.codeUse);
router.post('/unlinkCode', AffiliateController.unlinkCode);
router.post('/reward', RewardController.addReward);
router.post('/getReward', RewardController.getReward);
router.put('/boost', userController.addExp);
router.put('/claim', userController.claim);
router.patch('/tip', userController.tip);
router.get('/leaders', userController.getLeaders);
router.post('/game', gameController.createGame);
router.patch('/game', gameController.joinGame);
router.get('/game', gameController.getGames);
router.post('/cancelGame', gameController.cancelGame);
router.get('/winner', gameController.findWinner);
router.post('/endGame', gameController.deleteGame);
router.get('/history', userController.getHistory);
router.post('/history', historyController.addHistory);
router.post('/support', supportController.sendQuestion);
router.get('/support', supportController.getQuestions);
router.put('/support', supportController.answer);
router.get('/answers', supportController.getAnswers);
router.post('/market', marketController.addItemMarket);
router.get('/market', marketController.getItemsMarket);
router.put('/market', marketController.buyItemMarket);
router.post('/marketRemove', marketController.removeItemMarket);
router.post('/completeWithdraw', botController.completeWithdraw);
router.post('/bot', botController.addItemBot);
router.get('/getUserItems', botController.getUserItems);
router.get('/withdraw', botController.getWithdrawData);
router.post('/parseHtml', botController.parseHtml);
router.post('/decideWhichBot', botController.decideWhichBot);
router.get('/accountId', depositController.getAccountId);
router.post('/paymentAddress', depositController.createPaymentAddress);
router.post('/findAddress', depositController.findAddress);
router.post('/changeRole', adminController.changeRole);
router.post('/addBalance', adminController.addBalance);
router.post('/reduceBalance', adminController.reduceBalance);
router.post('/changeLevel', adminController.changeLevel);
router.post('/createItem', itemController.createItem);
router.post('/withdraw', withdrawController.addToQueue);
router.post('/increaseOnline', adminController.increaseOnline);
router.post('/decreaseOnline', adminController.decreaseOnline);
router.post('/banUser', adminController.banUser);
router.post('/unbanUser', adminController.unbanUser);
router.get('/transactions', depositController.getTransactions);
router.post('/notification-webhook', depositController.getNotified);
router.get('/payments', userController.getPayments);
router.get('/adminUser', adminController.getUser);
router.patch('/joinWithGems', gameController.joinWithGems);
router.post('/createWithGems', gameController.createWithGems);
router.post('/message', chatController.sendMessage);
router.get('/message', chatController.getMessages);
router.get('/linkedCode', linkedCodeController.getLinkedCode);
router.post('/linkedCode', linkedCodeController.linkLinkedCode);

export default router;