import { Router } from "express";
import { redditController } from "../controllers/reddit.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { redditSearchSchema } from "../validators/reddit.validator";

const router = Router();

router.post(
  "/search",
  authenticate,
  validateBody(redditSearchSchema),
  asyncHandler(redditController.search.bind(redditController))
);

export default router;
