import chatService from "../services/chatService.js";

class ChatController {
    async sendMessage(req, res, next) {
        try {
            const {user, time, avatar, id, message} = req.body;
            const send = await chatService.sendMessage(user, message, time, avatar, id);
            return res.json(send);
        } catch(e) {
            next(e);
        }
    }

    async getMessages(req, res, next) {
        try {
            const messages = await chatService.getMessages();
            return res.json(messages);
        } catch(e) {
            next(e);
        }
    }
}

export default new ChatController();