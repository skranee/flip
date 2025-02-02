import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";
import {fake, handleOnline} from "../websocket.js";
import {getReceiverId, receiverChange} from "./gameService.js";
import tokenService from "./token-service.js";

let taxStatus = {
    adminChanged: '...',
    timeEnding: 'Until switched',
    givenFor: 'Infinite time'
}

let cancel = () => {

}

class AdminService {
    async changeRole(refreshToken, username, role) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        const user = await userModel.findOne({username: username});
        if(user && user.role === 'admin') {
            return ApiError.BadRequest('Can not change admins');
        }
        const change = await userModel.updateOne({username: username}, {role: role});
        return change;
    }

    async addBalance(key, refreshToken, username, value) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        if(key !== process.env.API_KEY) {
            return ApiError.BadRequest('Not allowed');
        }
        const candidate = await userModel.findOne({_id: admin});
        if(!candidate || candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        const add = await userModel.updateOne({username: username}, {$inc: {balance: value}});
        return add;
    }

    async reduceBalance(key, refreshToken, username, value) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        if(key !== process.env.API_KEY) {
            return ApiError.BadRequest('Not allowed');
        }
        const candidate = await userModel.findOne({_id: admin});
        if(!candidate || candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        const add = await userModel.updateOne({username: username}, {$inc: {balance: -value}});
        return add;
    }

    async changeLevel(refreshToken, username, level) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }
        if(level >= 100000) {
            return ApiError.BadRequest('Level must not be more than 99999');
        }
        const change = await userModel.updateOne({username: username}, {lvl: level});
        return change;
    }

    async increaseOnline(inc, refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }

        handleOnline(inc);
        return null;
    }

    async decreaseOnline(dec, refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }

        handleOnline(-dec);
        return null;
    }

    async getUser(username, refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        }

        const user = await userModel.findOne({username: username});
        return user;
    }

    async banUser(refreshToken, username) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        } else {
            const user = await userModel.findOne({username: username});
            if(user && user.role === 'admin') {
                return ApiError.BadRequest('Can not ban admins');
            }
            const ban = await userModel.updateOne({username: username}, {banned: true});
            return ban;
        }
    }

    async unbanUser(refreshToken, username) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        } else {
            const unban = await userModel.updateOne({username: username}, {banned: false});
            return unban;
        }
    }

    async getFake(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(candidate.role !== 'admin') {
            return ApiError.BadRequest('Not enough rights!');
        } else {
            return fake();
        }
    }

    async changeTaxReceiver(key, refreshToken, receiverUsername, time) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        if(key !== process.env.API_KEY) {
            return ApiError.BadRequest('Not allowed');
        }

        if(taxStatus.adminChanged !== '...') {
            return ApiError.BadRequest('Already switched!');
        }

        function formatDuration(duration) {
            const millisecondsPerSecond = 1000;
            const millisecondsPerMinute = millisecondsPerSecond * 60;
            const millisecondsPerHour = millisecondsPerMinute * 60;
            const millisecondsPerDay = millisecondsPerHour * 24;
            const millisecondsPerMonth = millisecondsPerDay * 30;

            const months = Math.floor(duration / millisecondsPerMonth);
            duration %= millisecondsPerMonth;

            const days = Math.floor(duration / millisecondsPerDay);
            duration %= millisecondsPerDay;

            const hours = Math.floor(duration / millisecondsPerHour);
            duration %= millisecondsPerHour;

            const minutes = Math.floor(duration / millisecondsPerMinute);

            let result = '';
            if (months > 0) {
                result += months + ' month' + (months > 1 ? 's' : '') + ' ';
            }
            if (days > 0) {
                result += days + ' day' + (days > 1 ? 's' : '') + ' ';
            }
            if (hours > 0) {
                result += hours + ' hour' + (hours > 1 ? 's' : '') + ' ';
            }
            if(minutes > 0 || result === '') {
                result += minutes + ' minute' + (minutes > 1 ? 's' : '');
            }

            return result;
        }

        function formatDate(date) {
            const options = {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                hourCycle: 'h12'
            };

            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
            return formattedDate.replace(',', '');
        }

        const candidate = await userModel.findOne({_id: admin});
        if(!candidate) {
            return ApiError.BadRequest('Have no right to do it!');
        }
        const receiver = await userModel.findOne({username: receiverUsername});
        if(!receiver) {
            return ApiError.BadRequest('No such user!');
        }

        receiverChange(receiver._id);

        const formattedDuration = formatDuration(time);

        const formattedEnding = formatDate(Date.now() + time);

        taxStatus.adminChanged = candidate.username;
        taxStatus.givenFor = formattedDuration;
        taxStatus.timeEnding = formattedEnding;

        const timeoutId = setTimeout(() => {
            receiverChange(process.env.DEFAULT_RECEIVER);
            taxStatus.givenFor = 'Infinite time';
            taxStatus.adminChanged = '...';
            taxStatus.timeEnding = 'Until switched';
        }, time);

        function cancelTimeout() {
            clearTimeout(timeoutId);
            receiverChange(process.env.DEFAULT_RECEIVER);
            taxStatus.givenFor = 'Infinite time';
            taxStatus.adminChanged = '...';
            taxStatus.timeEnding = 'Until switched';
        }

        cancel = cancelTimeout;

        return getReceiverId();
    }

    async getReceiver(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(!candidate) {
            return ApiError.BadRequest('Have no right to do it!');
        }

        const taxReceiver = getReceiverId();
        const receiver = await userModel.findOne({_id: taxReceiver});
        if(!receiver) {
            return ApiError.BadRequest('Unexpected error');
        }
        return receiver.username;
    }

    async getTaxInfo(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(!candidate) {
            return ApiError.BadRequest('Have no right to do it!');
        }
        return taxStatus;
    }

    async cancelTaxChange(refreshToken) {
        const tokenData = await tokenService.findToken(refreshToken);
        if(!tokenData) {
            return ApiError.UnauthorizedError();
        }
        const admin = tokenData.user.toString();

        const candidate = await userModel.findOne({_id: admin});
        if(!candidate) {
            return ApiError.BadRequest('Have no right to do it!');
        }
        cancel();
        if(taxStatus.adminChanged === '...') {
            return 'success';
        } else {
            return 'failed';
        }
    }
}

export default new AdminService();