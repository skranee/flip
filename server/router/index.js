import {Router} from "express";
import userController from "../controllers/user-controller.js";

const router = new Router();

router.post('/getUser', userController.getUser);
router.get('/getUserDescription', userController.getUserDescription);
router.get('/getUserAvatar', userController.getUserAvatar);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.post('/saveToDB', userController.saveToDB);

export default router;