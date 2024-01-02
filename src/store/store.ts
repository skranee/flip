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

export default class Store {
    user = {} as IUser;
    avatar = '';
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this)
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

    async getUser(username: string) {
        try {
            const response = await AuthService.getUser(username);
            return response.data;
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

    async addItem(userId: string, item: IItem) {
        try{
            const response = await UserService.addItem(item, userId);
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

    async getReward(lvl: number) {
        try {
            const reward = await UserService.getReward(lvl);
            return reward;
        } catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addReward(image: string, name: string, lvl: number, description: string = 'Bonus') {
        try {
            if(this.user.role !== 'admin') {
                throw Error('Have not enough rights for this action!');
            }
            const reward = await AdminService.addReward(image, name, lvl, description);
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
            this.setUser(claim.data)
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

    async createGame(player1: IUser, items: IItem[]) {
        try {
            const game = await GameService.createGame(player1,items);
            return game;
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
}