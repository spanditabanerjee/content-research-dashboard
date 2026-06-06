import { Router } from "express";
import { historyController } from "../controllers/history.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  validateParams,
  validateQuery,
} from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  analysisIdParamSchema,
  historyPaginationSchema,
} from "../validators/history.validator";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validateQuery(historyPaginationSchema),
  asyncHandler(historyController.getResults.bind(historyController))
);

router.get(
  "/:id",
  validateParams(analysisIdParamSchema),
  asyncHandler(historyController.getResultById.bind(historyController))
);

export default router;
