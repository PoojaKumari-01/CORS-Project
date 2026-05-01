import jwt from "jsonwebtoken";
import { options } from "../config/cookieOption.js";

export function jwtMiddleware(req, res, next) {
  try {
    const jwtCookie = req.cookies["JWT"];
    if (!jwtCookie) {
      throw new Error("JWT cookie not found");
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error("JWT has expired");
    }
    const tokenData = decodedToken;
    req.id = tokenData.id;
    req.type = tokenData.type;
    req.login_id = tokenData.login_id;
    next();
  } catch (error) {
    res.clearCookie("JWT", options);
    res.status(401).json({
      error: "Unauthorized access. Please log in again.",
    });
  }
}

export function roleMiddleware(req, res, next) {
  if (req.type !== "admin") {
    return res.status(403).json({
      error: "Forbidden: You do not have permission to access this resource.",
    });
  }
  next();
}

export function getUserInfo(req, res) {
  try {
    const jwtCookie = req.cookies["JWT"];
    if (!jwtCookie) {
      throw new Error("JWT cookie not found");
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (!decodedToken) {
      throw new Error("Invalid JWT token");
    }
    if (new Date(decodedToken.exp * 1000) < new Date()) {
      throw new Error("JWT has expired");
    }
    return res.status(200).json({
      data: decodedToken,
    });
  } catch (error) {
    res.clearCookie("JWT", options);
    return res.status(401).json({
      error: "Unauthorized access. Please log in again.",
    });
  }
}

export function logout(_req, res) {
  try {
    res.clearCookie("JWT", options);
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while logging out",
    });
  }
}
