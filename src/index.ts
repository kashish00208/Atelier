import express from 'express'
const app = express();
import { registerUser , loginUser , logoutUser } from './auth/auth.route';

app.use(express.json());

//Authentication Routes 
app.post("/auth/ragister",registerUser)
app.post("/auth/login",loginUser)
app.post("/auth/logout",logoutUser)