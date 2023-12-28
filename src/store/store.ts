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
}