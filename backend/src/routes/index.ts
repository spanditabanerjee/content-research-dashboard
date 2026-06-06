import { Router } from "express";
import analysisRoutes from "./analysis.routes";
import authRoutes from "./auth.routes";
import historyRoutes from "./history.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/analyze", analysisRoutes);
router.use("/results", historyRoutes);

export default router;
