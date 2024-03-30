import {makeAutoObservable} from "mobx";
import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService";
import {IUserInfo} from "../models/IUserInfo";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import {IItem} from "../models/IItem";
import UserService from "../services/UserService";
import AffiliateService from "../services/AffiliateService";
import AdminService from "../services/AdminService";
import GameService from "../services/GameService";
import IGame from "../models/IGame";
import SupportService from "../services/SupportService";
import MarketService from "../services/MarketService";
import BotService from "../services/BotService";
import DepositService from "../services/DepositService";
import Item from "../models/Item";
import WithdrawService from "../services/WithdrawService";
import LinkedCodeService from "../services/LinkedCodeService";
import BotEntityService from "../services/BotEntityService";

export default class Store {
    user = {} as IUser;
    avatar = '';
    code = '';
    isAuth = false;
    isLoading = false;
    itemsList = [] as IItem[];

    constructor() {
        makeAutoObservable(this)
    }

    setCode(code: string) {
        this.code = code;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setAuth (bool: boolean) {
        this.isAuth = bool;
    }

    setLoading (bool: boolean) {
        this.isLoading = bool;
    }

    setAvatar(url: string) {
        this.avatar = url;
    }

    setItemsList(items: IItem[]) {
        this.itemsList = items.sort((a, b) => b.price - a.price);
    }

    async getUser(username: string) {
        try {
            const response = await AuthService.getUser(username);
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getAvatar(userId: number) {
        try {
            const response = await AuthService.getUserAvatar(userId);
            return response.data;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async verifyDescription(username: string) {
        try {
            const response = await AuthService.verifyDescription(username);

            if(response && response.data && response.data.match && response.data.match === 'failed') {
                return response;
            }

            if (response && response.data && response.data.user) {
                if (response.data.accessToken) {
                    this.setUser(response.data.user);
                    this.setAuth(true);
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('username', response.data.user.username);
                }
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            this.setItemsList([]);
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            if(response && response.data && response.data.user && response.data.accessToken) {
                this.setUser(response.data.user);
                this.setAuth(true);
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('username', response.data.user.username);
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async getUserItems() {
        try {
            const items = await BotService.getUserItems();
            this.setItemsList(items.data);
            return items.data;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createAffiliate(code: string) {
        try {
            if(!this.isAuth) {
                return null;
            }
            const response = await AffiliateService.createAffiliate(code);
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getAffiliate() {
        try {
            const response = await AffiliateService.getAffiliate();
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getBalance() {
        try {
            const add = await AffiliateService.getBalance();
            return add;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getReward() {
        try {
            const reward = await UserService.getReward();
            return reward;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addReward(name: string, lvl: number, gemsAmount: number) {
        try {
            if(this.user.role !== 'admin') {
                return Error('Have not enough rights for this action!');
            }
            const reward = await AdminService.addReward(name, lvl, gemsAmount);
            return reward;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async claim() {
        try {
            const claim = await UserService.claim();
            try {
                const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true});
                if(response && response.data && response.data.user && response.data.accessToken) {
                    this.setUser(response.data.user);
                    this.setAuth(true);
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('username', response.data.user.username);
                }
            } catch(e: any) {
                localStorage.removeItem('avatarUrl');
                console.log(e.response?.data?.message);
            }
            return claim;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async tip(to: string, amount: number) {
        try {
            const send = await UserService.tip(to, amount);
            try {
                const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
                if(response && response.data && response.data.user && response.data.accessToken) {
                    this.setUser(response.data.user);
                    this.setAuth(true);
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('username', response.data.user.username);
                }
            } catch(e: any) {
                console.log(e.response?.data?.message);
            }
            return send;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getLeaders() {
        try {
            const leaders = await UserService.getLeaders();
            return leaders;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createGame(items: IItem[], side: string) {
        try {
            const game = await GameService.createGame(items, side);
            return game;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async joinGame(items: IItem[], side: string, gameId: string) {
        try {
            const join = await GameService.joinGame(items, side, gameId);
            return join;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async cancelGame(game: IGame) {
        try {
            const cancel = await GameService.cancelGame(game);
            return cancel;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getGames() {
        try {
            const games = await GameService.getGames();
            return games;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getHistory() {
        try {
            const history = await UserService.getHistory();
            return history;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async sendQuestion(message: string) {
        try {
            const send = await SupportService.sendQuestion(message);
            return send;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getQuestions() {
        try {
            if(this.user.role === 'admin' && this.isAuth) {
                const questions = await SupportService.getQuestions();
                return questions;
            } else {
                throw Error('Not enough rights to get questions');
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async answer(id: string, mes: string) {
        try {
            const answer = await SupportService.answer(id, mes);
            return answer;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getAnswers() {
        try {
            const answers = await SupportService.getAnswers();
            return answers;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addItemMarket(item: IItem) {
        try {
            const add = await MarketService.addItemMarket(item);
            return add;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getItemsMarket() {
        try {
            const items = await MarketService.getItemsMarket();
            return items;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async removeItemMarket(itemId: string) {
        try {
            const remove = await MarketService.removeItemMarket(itemId);
            return remove;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async buyItemMarket(itemId: string) {
        try {
            const buy = await MarketService.buyItemMarket(itemId);
            return buy;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getWithdrawData() {
        try {
            const response = await BotService.getWithdrawData();
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createPaymentAddress(currency: string) {
        try {
            const address = await DepositService.createPaymentAddress(currency);
            return address;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async findAddress(currency: string) {
        try {
            const address = await DepositService.findAddress(currency);
            return address;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async changeRole(username: string, role: string) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.changeRole(username, role);
            return change;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addBalance(username: string, value: number) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.addBalance(username, value);
            return change;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async reduceBalance(username: string, value: number) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.reduceBalance(username, value);
            return change;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async increaseOnline(change: number) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const handle = await AdminService.increaseOnline(change);
            return handle;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async decreaseOnline(change: number) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const handle = await AdminService.decreaseOnline(change);
            return handle;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async changeLevel(username: string, level: number) {
        try{
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.changeLevel(username, level);
            return change;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getUserAdmin(username: string) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const user = await AdminService.getUser(username);
            return user;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addToQueue(robloxId: string, items: Item[]) {
        try {
            const add = await WithdrawService.addToQueue(robloxId, items);
            return add;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getPayments(userId: string) {
        try {
            const payments = await UserService.getPayments(userId);
            return payments;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async joinWithGems(side: string, gameId: string, gemsAmount: number) {
        try {
            const join = await GameService.joinWithGems(side, gameId, gemsAmount);
            return join;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createWithGems(gemsAmount: number, side: string) {
        try{
            const create = await GameService.createWithGems(gemsAmount, side);
            return create;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkForCode(code: string) {
        try {
            const response = await AffiliateService.checkForCode(code);
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async linkCode(code: string) {
        try {
            const link = await AffiliateService.linkCode(code);
            return link;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async codeUse(code: string, payment: number) {
        try {
            const use = await AffiliateService.codeUse(code, payment);
            return use;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async unlinkCode(code: string) {
        try {
             const unlink = await AffiliateService.unlinkCode(code);
             return unlink;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getLinkedCode() {
        try {
            const code = await LinkedCodeService.getLinkedCode();
            return code;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async linkLinkedCode(code: string) {
        try {
            const link = await LinkedCodeService.linkLinkedCode(code);
            return link;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async banUser(username: string) {
        try {
            if(this.user.role !== 'admin') {
                return new Error('Not enough rights!');
            } else {
                const ban = await AdminService.banUser(username);
                return ban;
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async unbanUser(username: string) {
        try {
            if(this.user.role !== 'admin') {
                return new Error('Not enough rights!');
            } else {
                const unban = await AdminService.unbanUser(username);
                return unban;
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getBots() {
        try {
            const bots = await BotEntityService.getBots();
            return bots;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addBot(serverUrl: string, name: string, avatar: string, robloxId: string) {
        try{
            if(this.user.role === 'admin' || this.user.role === 'developer') {
                const add = await BotEntityService.addBot(serverUrl, name, avatar, robloxId);
                return add;
            } else {
                return 'Not enough rights!';
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getGiveawayItems() {
        try {
            if(this.user.role !== 'admin') {
                return null;
            }
            const items = await BotService.getGiveawayItems();
            return items;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async startGiveaway(adminId: string, items: IItem[]) {
        try {
            if(this.user.role === 'admin') {
                const start = await BotService.startGiveaway(adminId, items);
                return start;
            }
            return null;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async get24hours() {
        try {
            const list = await UserService.get24hours();
            return list;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getFake() {
        try {
            if(this.user.role === 'admin') {
                const fake = await AdminService.getFake();
                return fake;
            }
            return null;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async changeTaxReceiver(receiverUsername: string, time: number) {
        try {
            if(this.user.role === 'admin') {
                const change = await AdminService.changeTaxReceiver(receiverUsername, time);
                return change;
            }
            return null;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getReceiver() {
        try {
            if(this.user.role === 'admin') {
                const receiver = await AdminService.getReceiver();
                return receiver;
            }
            return null;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getTaxInfo() {
        try {
            if(this.user.role === 'admin') {
                const data = await AdminService.getTaxInfo();
                return data;
            }
            return null;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async cancelTaxChange() {
        try {
            if(this.user.role === 'admin') {
                const cancel = await AdminService.cancelTaxChange();
                return cancel;
            }
            return null;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async sendMessage(message: object) {
        try {
            if(!this.isAuth) {
                return null;
            }
            const send = await UserService.sendMessage(message);
            return send;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }
}