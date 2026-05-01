import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "./config/db_config.js";
import { userRouter } from "./routes/user_route.js";
import { authRouter } from "./routes/auth_route.js";
import { roleRouter } from "./routes/role_route.js";
import { permissionRouter } from "./routes/permission_route.js";
import { jwtMiddleware, roleMiddleware } from "./middleware/auth_middleware.js";
import { FRONTEND_URL, PORT } from "./config/env_config.js";

const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", jwtMiddleware, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/role", jwtMiddleware, roleMiddleware, roleRouter);
app.use("/api/permission", jwtMiddleware, roleMiddleware, permissionRouter);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connect();
  console.log("mongodb connected");
});
