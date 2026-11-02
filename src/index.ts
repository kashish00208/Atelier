import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "./auth/auth.route";

import { authenticateToken } from "./auth/auth.middleware"
import { getUSerProfile } from "./auth/auth.getUser";

const app = express();

app.use(express.json());

// Public authentication routes
app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);

// Protected authentication route
app.post("/auth/logout", authenticateToken, logoutUser);

// Protected user routes
app.get("/user/profile", authenticateToken, getUSerProfile);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});