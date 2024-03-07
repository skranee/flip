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
import ItemService from "../services/ItemService";
import Item from "../models/Item";
import WithdrawService from "../services/WithdrawService";
import ChatService from "../services/ChatService";
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

    async getBio(userId: number) {
        try {
            const response = await AuthService.getBio(userId);
            return response.data;
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

    async saveToDb(user: IUserInfo) {
        try {
            const response = await AuthService.saveToDb(user);
            this.setUser(response.data.user);
            this.setAuth(true);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('username', response.data.user.username);
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            this.setUser(response.data.user);
            this.setAuth(true);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('username', response.data.user.username);
        } catch(e: any) {
            localStorage.removeItem('avatarUrl');
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async getUserItems(userId: string) {
        try {
            const items = await BotService.getUserItems(userId);
            this.setItemsList(items.data);
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addItem(userId: string, item: IItem) {
        try{
            const response = await UserService.addItem(item, userId);
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createAffiliate(code: string, userId: string) {
        try {
            if(!this.isAuth) {
                throw new Error('Not Authorized!');
            }
            const response = await AffiliateService.createAffiliate(code, userId);
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getAffiliate(userId: string) {
        try {
            const response = await AffiliateService.getAffiliate(userId);
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getBalance(userId: string) {
        try {
            const add = await AffiliateService.getBalance(userId);
            return add;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getReward(lvl: number) {
        try {
            const reward = await UserService.getReward(lvl);
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

    async addExp(id: string, exp: number) {
        try {
            if(this.user.role !== 'admin') {
                throw Error ('Have not enough rights for this action!');
            }
            const update = await UserService.addExp(id, exp);
            return update;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async claim(id: string) {
        try {
            const claim = await UserService.claim(id);
            this.checkAuth();
            return claim;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async tip(from: string, to: string, amount: number) {
        try {
            const send = await UserService.tip(from, to, amount);
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

    async createGame(player1: IUser, items: IItem[], side: string) {
        try {
            const game = await GameService.createGame(player1,items, side);
            return game;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async joinGame(player2: IUser, items: IItem[], side: string, gameId: string) {
        try {
            const join = await GameService.joinGame(player2, items, side, gameId);
            return join;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async cancelGame(user: IUser, game: IGame) {
        try {
            const cancel = await GameService.cancelGame(user, game);
            return cancel;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async findWinner(gameId: string) {
        try {
            const response = await GameService.findWinner(gameId);
            return response;
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

    async getHistory(userId: string) {
        try {
            const history = await UserService.getHistory(userId);
            return history;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addHistory(userId: string, game: IGame) {
        try {
            const add = await UserService.addHistory(userId, game);
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async endGame(gameId: string) {
        try {
            const end = await GameService.endGame(gameId);
            return end;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async sendQuestion(message: string, userId: string) {
        try {
            const send = await SupportService.sendQuestion(message, userId);
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

    async getAnswers(userId: string) {
        try {
            const answers = await SupportService.getAnswers(userId);
            return answers;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addItemMarket(userId: string, item: IItem) {
        try {
            const add = await MarketService.addItemMarket(userId, item);
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

    async buyItemMarket(ownerId: string, buyerId: string, itemId: string) {
        try {
            const buy = await MarketService.buyItemMarket(ownerId, buyerId, itemId);
            return buy;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async completeWithdraw(robloxId: string) {
        try {
             const check = await BotService.completeWithdraw(robloxId);
             return check;
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

    async addItemBot(robloxId: string, item: IItem) {
        try {
            const add = await BotService.addItemBot(robloxId, item);
            return add;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getAccountId(currency: string) {
        try {
            const id = await DepositService.getAccountId(currency);
            return id;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createPaymentAddress(currency: string, user: string) {
        try {
            const address = await DepositService.createPaymentAddress(currency, user);
            console.log(address);
            return address;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async findAddress(user: string, currency: string) {
        try {
            const address = await DepositService.findAddress(user, currency);
            return address;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getTransactions() {
        try {
            const response = await DepositService.getTransactions();
            return response;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async changeRole(admin: string, username: string, role: string) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.changeRole(admin, username, role);
            return change;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addBalance(admin: string, username: string, value: number) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.addBalance(admin, username, value);
            return change;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async reduceBalance(admin: string, username: string, value: number) {
        try {
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.reduceBalance(admin, username, value);
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

    async changeLevel(admin: string, username: string, level: number) {
        try{
            if(this.user.role !== 'admin') {
                throw new Error('Not enough rights to change the role!');
            }
            const change = await AdminService.changeLevel(admin, username, level);
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

    async createItem(name: string, value: number) {
        try {
            const item = await ItemService.createItem(name, value);
            return item;
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

    async joinWithGems(player2: IUser, side: string, gameId: string, gemsAmount: number) {
        try {
            const join = await GameService.joinWithGems(player2, side, gameId, gemsAmount);
            return join;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async createWithGems(player1: IUser, gemsAmount: number, side: string) {
        try{
            const create = await GameService.createWithGems(player1, gemsAmount, side);
            return create;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async sendMessage(user: IUser, message: string, time: string, id: string, avatar: string) {
        try {
            const send = await ChatService.sendMessage(user, message, time, id, avatar);
            return send;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async getMessages() {
        try {
            const messages = await ChatService.getMessages();
            return messages;
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

    async getLinkedCode(userId: string) {
        try {
            const code = await LinkedCodeService.getLinkedCode(userId);
            return code;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async linkLinkedCode(code: string, userId: string) {
        try {
            const link = await LinkedCodeService.linkLinkedCode(code, userId);
            return link;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async banUser(admin: string, username: string) {
        try {
            if(this.user.role !== 'admin') {
                return new Error('Not enough rights!');
            } else {
                const ban = await AdminService.banUser(admin, username);
                return ban;
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async unbanUser(admin: string, username: string) {
        try {
            if(this.user.role !== 'admin') {
                return new Error('Not enough rights!');
            } else {
                const unban = await AdminService.unbanUser(admin, username);
                return unban;
            }
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async decideWhichBot(items: IItem[]) {
        try {
            const decide = await BotService.decideWhichBot(items);
            return decide;
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
}