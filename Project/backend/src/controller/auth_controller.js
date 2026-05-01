import { options } from "../config/cookieOption.js";
import { AuthService } from "../service/auth_service.js";
import { createJWTtoken } from "../util/jwt_util.js";

export class AuthController {
  #authService;

  constructor() {
    this.#authService = new AuthService();
  }

  async signupUser(req, res) {
    const { id, password } = req.body;
    try {
      const user = await this.#authService.signupUser(id, password);
      const token = createJWTtoken({
        id: user._id,
        type: user.type,
        login_id: user.login_id,
      });
      res.cookie("JWT", token, options);
      res.status(200).json({ message: "User created successful" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async loginUser(req, res) {
    const { login_id, password } = req.body;
    try {
      const user = await this.#authService.loginUser(login_id, password);
      const token = createJWTtoken({
        id: user._id,
        type: user.type,
        login_id: user.login_id,
      });
      res.cookie("JWT", token, options);
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          login_id: user.login_id,
          type: user.type,
          permissions: user.permissions || [],
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logoutUser(req, res) {
    res.clearCookie("JWT");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  }
}
