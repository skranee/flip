import {makeAutoObservable} from "mobx";

export default class GlobalStore {
    logOpen = false;
    gamesJoin = 3;
    gamesAll = 8;
    titleHL = 'Sort';
    titleAll = 'All';
    viewOpen = false;
    gameInfo = null;
    streamLive = false;
    profileUser = {};
    profileAv = '';
    profileOpen = false;
    createOpen = false;
    historyOpen = false;

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

    setStreamLive(bool) {
        this.streamLive = bool;
    }

    setProfileUser(user) {
        this.profileUser = user;
    }

    setProfileAv(av) {
        this.profileAv = av;
    }

    setProfileOpen(bool) {
        this.profileOpen = bool;
    }

    setCreateOpen(bool) {
        this.createOpen = bool;
    }

    setHistoryOpen(bool) {
        this.historyOpen = bool;
    }
}