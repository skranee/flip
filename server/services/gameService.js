import gameModel from "../models/game-model.js";
import ApiError from "../exceptions/api-error.js";
import {v4 as uuidv4} from 'uuid';
import userModel from "../models/user-model.js";
import {ObjectId} from "mongodb";
import botModel from "../models/bot-model.js";
import axios from "axios";
import historyService from "./historyService.js";
import userService from "./user-service.js";

let taxReceiver = '65fe0da4bcf478f617682461';

export const receiverChange = (id) => {
    taxReceiver = id;
}

export const getReceiverId = () => {
    return taxReceiver;
}

class GameService {
    async createGame(player1, items, side) {
        const gameId = uuidv4();
        if(!items || items.length === 0) {
            return ApiError.BadRequest('Can not create game with nothing');
        }
        for(const item of items) {
            if(item.owner === '000000000000000000000000') {
                return ApiError.BadRequest('Can not bet these items');
            }
        }
        for (const item of items) {
            await botModel.updateOne({itemId: item.itemId}, {owner: new ObjectId('000000000000000000000000')})
        }
        const game = await gameModel.create({player1: player1.id, items1: items, gameId: gameId, side1: side});
        return game;
    }

    async createWithGems(player1, gemsAmount, side) {
        const user = await userModel.findOne({_id: player1.id});
        if(user && user.balance < gemsAmount) {
            return ApiError.BadRequest('Not enough balance');
        }
        if(gemsAmount <= 0 || !gemsAmount) {
            return ApiError.BadRequest('Gems amount must be greater than 0');
        }
        const gameId = uuidv4();
        const updateBalance = await userModel.updateOne({_id: player1.id}, {$inc: {balance: -gemsAmount}});
        const game = await gameModel.create({player1: player1.id, gems1: gemsAmount, side1: side, gameId: gameId});
        return game;
    }

    async joinGame(player2, items, side, gameId) {
        const gameCheck = await gameModel.findOne({gameId: gameId});
        if(!player2.id) {
            return ApiError.BadRequest('Authorize first');
        }
        if(!items || items.length === 0) {
            return ApiError.BadRequest('Can not join game with nothing');
        }
        if(gameCheck && gameCheck.player2) {
            return ApiError.BadRequest('The game is already going');
        } else {
            for (const item of items) {
                await botModel.updateOne({itemId: item.itemId}, {owner: new ObjectId('000000000000000000000000')})
            }
            const game = await gameModel.findOneAndUpdate({gameId: gameId}, {player2: player2.id, items2: items, side2: side, status: 'Ongoing'}, {new: true});

            const random = await this.findWinner(gameId);
            const result = random.winner === 'first' ? 'First player won' : 'Second player won';
            const updateWinner = await gameModel.updateOne({gameId: gameId}, {result: result});

            if(game.items1 && game.items1.length > 0) {
                const itemsFirst = game.items1;
                const totalValue = itemsFirst.reduce((a, b) => a + b.price, 0);

                const cutter = Math.round(totalValue * 0.1);
                const sorted = itemsFirst.sort((a, b) => b.price - a.price);
                let itemsToProceed = [];
                let itemsCut = [];
                for(const item of sorted) {
                    if(item.price <= cutter
                        && itemsCut.reduce((a, b) => a + b.price, 0) <= cutter
                        && itemsCut.reduce((a, b) => a + b.price, 0) + item.price <= cutter) {
                        itemsCut.push(item);
                    } else {
                        itemsToProceed.push(item);
                    }
                }

                for(const item of itemsCut) {
                    await botModel.updateOne({itemId: item.itemId}, {owner: taxReceiver});
                }

                for(const item of itemsToProceed) {
                    await botModel.updateOne({itemId: item.itemId}, {owner: result === 'First player won' ? game.player1 : player2.id});
                }
            }
            if(game.gems1) {
                const gems = game.gems1;
                await userModel.updateOne({_id: result === 'First player won' ? game.player1 : player2.id}, {$inc: {balance: Math.round(0.9 * gems)}});
            }
            if(items) {
                const totalValue = items.reduce((a, b) => a + b.price, 0);

                const cutter = Math.round(totalValue * 0.1);
                const sorted = items.sort((a, b) => b.price - a.price);
                let itemsToProceed = [];
                let itemsCut = [];
                for(const item of sorted) {
                    if(item.price <= cutter
                        && itemsCut.reduce((a, b) => a + b.price, 0) <= cutter
                        && itemsCut.reduce((a, b) => a + b.price, 0) + item.price <= cutter) {
                        itemsCut.push(item);
                    } else {
                        itemsToProceed.push(item);
                    }
                }

                for(const item of itemsCut) {
                    await botModel.updateOne({itemId: item.itemId}, {owner: taxReceiver});
                }

                for(const item of itemsToProceed) {
                    await botModel.updateOne({itemId: item.itemId}, {owner: result === 'First player won' ? game.player1 : player2.id});
                }
            }

            const gameToPass = await gameModel.findOne({gameId: gameId}).populate('player1').populate('player2');

            if(game.items1) {
                const price = game.items1.reduce((a, b) => a + b.price / 2,5, 0);
                await userService.addExp(game.player1, Math.round(price / 40));
            }
            if(game.gems1) {
                await userService.addExp(game.player1, Math.round(game.gems1 / 40));
            }
            const itemsPrice = items.reduce((a, b) => a + b.price, 0);
            await userService.addExp(player2.id, Math.round(itemsPrice / 40));

            const history = await historyService.addHistory(gameToPass);

            setTimeout(async () => {
                const deleteGame = await this.deleteGame(gameId);
            }, 60000);

            return {
                game: gameToPass,
                link: random.link,
                number: random.randomNumber
            };
        }
    }

    async joinWithGems(player2, side, gameId, gemsAmount) {
        const gameCheck = await gameModel.findOne({gameId: gameId});
        if(!player2.id) {
            return ApiError.BadRequest('Authorize first');
        }
        if(gemsAmount <= 0 || !gemsAmount) {
            return ApiError.BadRequest('Can not join with nothing');
        }
        if(gameCheck && gameCheck.player2) {
            return ApiError.BadRequest('The game is already going');
        } else {
            const reduceBalance = await userModel.updateOne({_id: player2.id}, {$inc: {balance: -gemsAmount}});
            const game = await gameModel.findOneAndUpdate({gameId: gameId}, {player2: player2.id, gems2: gemsAmount, side2: side, status: 'Ongoing'});
            let gems1 = 0;
            if(game && game.gems1) {
                gems1 = game.gems1;
            }
            const random = await this.findWinner(gameId);
            const result = random.winner === 'first' ? 'First player won' : 'Second player won'
            const updateWinner = await gameModel.updateOne({gameId: gameId}, {result: result, checkLink: random.link});
            if(game.items1 && game.items1.length > 0) {
                const itemsFirst = game.items1;
                const totalValue = itemsFirst.reduce((a, b) => a + b.price, 0);

                const cutter = Math.round(totalValue * 0.1);
                const sorted = itemsFirst.sort((a, b) => b.price - a.price);
                let itemsToProceed = [];
                let itemsCut = [];
                for(const item of sorted) {
                    if(item.price <= cutter
                        && itemsCut.reduce((a, b) => a + b.price, 0) <= cutter
                        && itemsCut.reduce((a, b) => a + b.price, 0) + item.price <= cutter) {
                        itemsCut.push(item);
                    } else {
                        itemsToProceed.push(item);
                    }
                }

                for(const item of itemsCut) {
                    await botModel.updateOne({itemId: item.itemId}, {owner: taxReceiver});
                }

                for(const item of itemsToProceed) {
                    await botModel.updateOne({itemId: item.itemId}, {owner: result === 'First player won' ? game.player1 : player2.id});
                }
            }

            if(result === 'First player won') {
                const addBalance = await userModel.updateOne({_id: game.player1}, {$inc: {balance: Math.round(0.9 * (gemsAmount + gems1))}});
            } else {
                const addBalance = await userModel.updateOne({_id: player2.id}, {$inc: {balance: Math.round(0.9 * (gemsAmount + gems1))}});
            }

            const gameToPass = await gameModel.findOne({gameId: gameId}).populate('player1').populate('player2');

            if(game.items1) {
                const price = game.items1.reduce((a, b) => a + b.price / 2,5, 0);
                await userService.addExp(game.player1, Math.round(price / 40));
            }
            if(game.gems1) {
                await userService.addExp(game.player1, Math.round(game.gems1 / 40));
            }
            await userService.addExp(player2.id, Math.round(gemsAmount / 40));

            const history = await historyService.addHistory(gameToPass);

            setTimeout(async () => {
                const deleteGame = await this.deleteGame(gameId);
            }, 15000);

            return {
                game: gameToPass,
                link: random.link,
                number: random.randomNumber
            };
        }
    }

    async cancelGame(user, game) {
        if(user.id === game.player1._id && game.status === 'Joinable') {
            if(game.items1.length > 0) {
                const items = game.items1;
                for(const item of items) {
                    const returnItems = await botModel.updateOne({itemId: item.itemId}, {owner: user.id});
                }
            }
            if(game.gems1) {
                const gems = game.gems1;
                const returnGems = await userModel.updateOne({_id: game.player1._id}, {$inc: {balance: gems}});
            }
            const removeGame = await gameModel.deleteOne({gameId: game.gameId});
        } else {
            return ApiError.BadRequest('Not enough rights to cancel the game');
        }
    }

    async getGames() {
        const games = await gameModel.find().populate('player1').populate('player2');
        return games;
    }

    async findWinner(gameId) {
        let bet1 = 0;
        let bet2 = 0;
        const apiKey = process.env.RANDOM_ORG_API_KEY;
        const minValue = 1;
        const maxValue = 10000;

        const game = await gameModel.findOne({gameId: gameId});
        function calculate(firstBet, secondBet) {
            return (firstBet / (firstBet + secondBet)).toFixed(4);
        }

        if(game.items1.length > 0) {
            bet1 = game.items1.reduce((a, b) => a + b.price, 0);
        } else if(game.gems1) {
            bet1 = game.gems1;
        }
        if(game.items2.length > 0) {
            bet2 = game.items2.reduce((a, b) => a + b.price, 0);
        } else if(game.gems2) {
            bet2 = game.gems2;
        }
        const chance1 = calculate(bet1, bet2) * 10000;

        const ticketResponse = await axios.post('https://api.random.org/json-rpc/4/invoke', {
            jsonrpc: '2.0',
            method: 'createTickets',
            params: {
                apiKey: apiKey,
                n: 1,
                showResult: true
            },
            id: 1
        })

        const ticket = ticketResponse.data.result[0].ticketId;

        const response = await axios.post('https://api.random.org/json-rpc/4/invoke', {
            jsonrpc: '2.0',
            method: 'generateSignedIntegers',
            params: {
                apiKey: apiKey,
                n: 1,
                min: minValue,
                max: maxValue,
                replacement: true,
                ticketId: ticket,
                userData: `1-${chance1} = first player wins, ${chance1 + 1} - 10000 = second player wins`
            },
            id: 1
        });

        const reveal = await axios.post('https://api.random.org/json-rpc/4/invoke', {
            jsonrpc: '2.0',
            method: 'revealTickets',
            params: {
                apiKey: apiKey,
                ticketId: ticket
            },
            id: 1
        })

        const link = `https://api.random.org/tickets/form?ticket=${ticket}`

        const randomNumber = response.data.result.random.data[0];
        // const signature = response.data.result.signature;

        const winner = randomNumber <= chance1 ? 'first' : 'second'

        return {
            randomNumber: randomNumber,
            // signature: signature,
            winner: winner,
            link: link
        }
    }

    async deleteGame(gameId) {
        const game = await gameModel.findOne({gameId: gameId});
        const player1 = await userModel.updateOne({_id: game.player1}, {$inc: {gamesPlayed: 1}});
        const player2 = await userModel.updateOne({_id: game.player2}, {$inc: {gamesPlayed: 1}});
        const end = await gameModel.deleteOne({gameId: gameId});
        return end;
    }
}

export default new GameService();