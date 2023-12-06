import {makeAutoObservable} from "mobx";
import {Game} from "../mainPage/playzone/gamesList";

export default class GlobalStore {
    logOpen = false;
    gamesJoin = 3;
    gamesAll = 8;
    titleHL = 'Sort';
    titleAll = 'All';
    viewOpen = false;
    gameInfo = null;

    constructor() {
        makeAutoObservable(this)
    }

    setLogOpen(bool) {
        this.logOpen = bool;
    }

    setGamesJoin(num) {
        this.gamesJoin = num;
    }

    setGamesAll(num) {
        this.gamesAll = num;
    }

    setTitleHL(title) {
        this.titleHL = title;
    }

    setTitleAll(title) {
        this.titleAll = title;
    }

    setViewOpen(bool) {
        this.viewOpen = bool;
    }

    setGameInfo(obj) {
        this.gameInfo = obj;
    }
}