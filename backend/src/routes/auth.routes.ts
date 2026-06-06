import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

router.get(
  "/me",
  authenticate,
  asyncHandler(authController.getMe.bind(authController))
);

export default router;
