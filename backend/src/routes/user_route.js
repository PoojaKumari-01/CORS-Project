import { Router } from "express";
import { UserController } from "../controller/user_controller.js";
import { roleMiddleware } from "../middleware/auth_middleware.js";

const userController = new UserController();
export const userRouter = Router();

userRouter.post(
  "/",
  roleMiddleware,
  userController.createUser.bind(userController)
);
userRouter.get("/", userController.getAllUsers.bind(userController));
userRouter.get(
  "/permissions",
  userController.getCurrentUserPermissions.bind(userController)
);
userRouter.get("/:id", userController.getUserById.bind(userController));
userRouter.delete(
  "/:id",
  roleMiddleware,
  userController.deleteUser.bind(userController)
);
userRouter.post(
  "/add-role",
  roleMiddleware,
  userController.addRoleToUser.bind(userController)
);
userRouter.post(
  "/remove-role",
  roleMiddleware,
  userController.removeRoleFromUser.bind(userController)
);
userRouter.put(
  "/:id/roles",
  roleMiddleware,
  userController.updateUserRoles.bind(userController)
);
