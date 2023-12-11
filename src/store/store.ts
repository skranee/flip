import {makeAutoObservable} from "mobx";
import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService";
import {IUserInfo} from "../models/IUserInfo";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

export default class Store {
    user = {} as IUser;
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
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}