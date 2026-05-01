import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const FRONTEND_URL = process.env.FRONTEND_URL || "https://cors-project.vercel.app/";export const PORT = process.env.PORT || 9000;