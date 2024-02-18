import messageModel from "../models/message-model.js";

class ChatService {
    async sendMessage(user, message, time, avatar, id) {
        const send = await messageModel.create({user: user, message: message, time: time, avatar: avatar, id: id});
        const messages = await messageModel.find();
        if(messages && messages.length > 49) {
            const removeFirst = await messageModel.deleteOne({removal: 1});
        }
        const renewed = await messageModel.find().populate('user');
        return renewed;
    }

    async getMessages() {
        const messages = await messageModel.find().populate('user');
        return messages;
    }
}

export default new ChatService();