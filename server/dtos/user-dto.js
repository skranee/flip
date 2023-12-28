export default class UserDto {
    username;
    avatar;
    id;
    robloxId;
    regDate;
    totalWagered;
    totalWithdrawn;
    totalDeposited;
    gamesPlayed;
    itemsList;
    balance;
    role;
    lvl;
    experience;
    gotReward;

    constructor(model) {
        this.username = model.username;
        this.avatar = model.avatar;
        this.id = model._id;
        this.robloxId = model.robloxId;
        this.regDate = model.regDate;
        this.totalWagered = model.totalWagered;
        this.totalWithdrawn = model.totalWithdrawn;
        this.totalDeposited = model.totalDeposited;
        this.gamesPlayed = model.gamesPlayed;
        this.itemsList = model.itemsList;
        this.balance = model.balance;
        this.role = model.role;
        this.lvl = model.lvl;
        this.experience = model.experience;
        this.gotReward = model.gotReward;
    }
}