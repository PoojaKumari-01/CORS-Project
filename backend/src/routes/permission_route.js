import { Router } from "express";
import { PermissionController } from "../controller/permission_controller.js";

const permissionController = new PermissionController();
export const permissionRouter = Router();

permissionRouter.post(
  "/",
  permissionController.createPermission.bind(permissionController)
);
permissionRouter.get(
  "/:id",
  permissionController.getPermissionById.bind(permissionController)
);
permissionRouter.delete(
  "/:id",
  permissionController.deletePermission.bind(permissionController)
);
permissionRouter.get(
  "/",
  permissionController.getAllPermissions.bind(permissionController)
);
permissionRouter.put(
  "/:id",
  permissionController.updatePermission.bind(permissionController)
);
