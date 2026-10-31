import express from 'express'
const app = express();
import { ragisterUSer , loginUSer , logoutUSer } from './auth/auth.route';

app.use(express.json());

//Authentication Routes 
app.post("/auth/ragister",ragisterUSer)
app.post("/auth/login",loginUSer)
app.post("/auth/logout",logoutUSer)