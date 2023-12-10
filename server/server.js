import {config} from "dotenv";
import express from 'express'
import bodyParser from "body-parser";
import cors from 'cors'
import axios from "axios";
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import router from './router/index.js'

config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', router)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

// app.post('/api/getUserInfo', async (req, res) => {
//     try {
//         const {username} = req.body;
//
//         //getting userId
//         const userInfo = await axios.post('https://users.roblox.com/v1/usernames/users',{
//             "usernames": [
//                 `${username}`
//             ],
//             "excludeBannedUsers": true
//         });
//
//         if (!userInfo.data|| !userInfo.data.data[0].id) {
//             console.error('Error: Empty response from Roblox API - getUserId');
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         const user = userInfo.data.data[0];
//
//         return res.json({user})
//     } catch (error) {
//         console.error('Error in getUserInfo endpoint:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Internal Server Error - getUserInfo' });
//     }
// });

// app.get('/api/getUserDescription', async (req, res) => {
//     try {
//         const userId = req.query.userId;
//
//         //getting user description
//         const userInfoResponse = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
//
//         const userBio = userInfoResponse.data.description;
//
//         res.json(userBio);
//     } catch (error) {
//         console.error('Error in getUserDescription endpoint:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Internal Server Error - getUserDescription' });
//     }
// });

// app.get('/api/getUserAvatar', async (req, res) => {
//     try {
//         const userId = req.query.userId;
//
//         //getting user info about avatar
//         const userInf = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=false`)
//
//         const avatar = userInf.data.data[0].imageUrl;
//
//         return res.json(avatar)
//     } catch (error) {
//         console.error('Error in getUserAvatar endpoint:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Internal Server Error - getUserAvatar' });
//     }
// })

start();
