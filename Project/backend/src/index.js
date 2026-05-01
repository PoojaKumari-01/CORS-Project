import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "./config/db_config.js";
import { userRouter } from "./routes/user_route.js";
import { authRouter } from "./routes/auth_route.js";
import { roleRouter } from "./routes/role_route.js";
import { permissionRouter } from "./routes/permission_route.js";
import { jwtMiddleware, roleMiddleware } from "./middleware/auth_middleware.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
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

app.listen(9000, async () => {
  console.log("Server is running on port 9000");
  await connect();
  console.log("mongodb connected");
});
