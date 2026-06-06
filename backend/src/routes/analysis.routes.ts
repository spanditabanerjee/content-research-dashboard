import { Router } from "express";
import { analysisController } from "../controllers/analysis.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { analyzeSchema } from "../validators/analysis.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  validateBody(analyzeSchema),
  asyncHandler(analysisController.analyze.bind(analysisController))
);

export default router;
