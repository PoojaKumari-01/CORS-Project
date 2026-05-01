import { Router } from "express";
import { RoleController } from "../controller/role_controller.js";

const roleController = new RoleController();
export const roleRouter = Router();

roleRouter.post("/", roleController.createRole.bind(roleController));
roleRouter.get("/", roleController.getAllRoles.bind(roleController));
roleRouter.get("/:id", roleController.getRoleById.bind(roleController));
roleRouter.delete("/:id", roleController.deleteRole.bind(roleController));
roleRouter.post(
  "/add-permission",
  roleController.addPermissionToRole.bind(roleController)
);
roleRouter.post(
  "/remove-permission",
  roleController.removePermissionFromRole.bind(roleController)
);
roleRouter.post(
  "/add-permissions-bulk",
  roleController.addPermissionsToRoleBulk.bind(roleController)
);
roleRouter.post(
  "/remove-permissions-bulk",
  roleController.removePermissionsFromRoleBulk.bind(roleController)
);
