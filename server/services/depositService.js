import crypto from 'crypto';
import axios from "axios";
import cryptoAddressModel from "../models/cryptoAddress-model.js";
import ApiError from "../exceptions/api-error.js";
import userModel from "../models/user-model.js";
import transactionModel from "../models/transaction-model.js";
import linkedCodeService from "./linkedCodeService.js";
import affiliateService from "./affiliateService.js";

class DepositService {

    async getAccountId(currency) {
        const timestamp = Math.floor(Date.now() / 1000);

        const message = `${timestamp}GET/v2/accounts`;

        const signature = crypto.createHmac('sha256', process.env.DEPOSIT_API_SECRET).update(message).digest('hex');

        const headers = {
            'CB-ACCESS-KEY': process.env.DEPOSIT_API_KEY,
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get('https://api.coinbase.com/v2/accounts', { headers });

            const accountId = response.data.data.filter(item => item.currency.code === currency);
            const id = accountId[0].id;

            return id;

        } catch (error) {
            console.error('Error while trying to get accountID', error.message);
        }
    }

    async createPaymentAddress(currency, user) {
        const accountId = await this.getAccountId(currency);
        function generateSignature(method, requestPath, body, timestamp) {
            const message = `${timestamp}${method}${requestPath}${JSON.stringify(body)}`;
            return crypto.createHmac('sha256', process.env.DEPOSIT_API_SECRET).update(message).digest('hex');
        }
        const timestamp = Math.floor(Date.now() / 1000);

        const requestData = {
            currency: currency,
            type: 'wallet'
        };

        const signature = generateSignature('POST', `/v2/accounts/${accountId}/addresses`, requestData, timestamp);

        const headers = {
            'CB-ACCESS-KEY': process.env.DEPOSIT_API_KEY,
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'Content-Type': 'application/json',
        };

        const response = await axios.post(`https://api.coinbase.com/v2/accounts/${accountId}/addresses`, requestData, { headers });

        const address = response.data.data.address;

        await this.bindAddress(address, user, currency);

        return address;
    }

    async findAddress(user, curr) {
        const note = await cryptoAddressModel.findOne({user: user, currency: curr});
        if(!note) {
            return null;
        }
        return note.address;
    }

    async bindAddress(address, user, curr) {
        await cryptoAddressModel.create({address: address, user: user, currency: curr});
    }

    async exchangeDeposit(amount, currency) {
        const timestamp = Math.floor(Date.now() / 1000);

        const message = `${timestamp}GET/v2/exchange-rates`;

        const signature = crypto.createHmac('sha256', process.env.DEPOSIT_API_SECRET).update(message).digest('hex');

        const headers = {
            'CB-ACCESS-KEY': process.env.DEPOSIT_API_KEY,
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'Content-Type': 'application/json',
        };

        const response = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${currency}`, {headers});
        const exchangedAmount = response.data.data.rates.USD * amount;
        return exchangedAmount;
    }

    async listNotifications() {
        const timestamp = Math.floor(Date.now() / 1000);

        const message = `${timestamp}GET/v2/notifications`;

        const signature = crypto.createHmac('sha256', process.env.DEPOSIT_API_SECRET).update(message).digest('hex');

        const headers = {
            'CB-ACCESS-KEY': process.env.DEPOSIT_API_KEY,
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'Content-Type': 'application/json',
        };

        const response = await axios.get(`https://api.coinbase.com/v2/notifications`, {headers});
        console.log(response.data.data);
    }

    async getNotified(data) {
        const amount = data.additional_data.amount.amount;
        const currency = data.additional_data.amount.currency;
        const exchangedAmount = await this.exchangeDeposit(amount, currency);
        const transactionAddress = data.data.address;

        const note = await cryptoAddressModel.findOne({address: transactionAddress});
        const userId = note.user;

        const checkForCode = await linkedCodeService.getLinkedCode(userId);
        let usedCode = '';
        if(checkForCode) {
            usedCode = checkForCode.linkedCode;
        }

        const balanceAdd = Math.round(exchangedAmount * 75) + (usedCode === '' ? 0 : exchangedAmount * 75 * 0.01);

        const affiliateOwner = await affiliateService.codeUse(usedCode, exchangedAmount * 75 * 0.01);

        const addTransaction = await transactionModel.create(
            {
                user: userId,
                address: transactionAddress,
                usdAmount: exchangedAmount,
                paymentCurrency: currency,
                receivedBalance: balanceAdd
            })
        const add = await userModel.updateOne({_id: userId}, {$inc: {balance: balanceAdd}});
        return null;
    }
}

export default new DepositService();