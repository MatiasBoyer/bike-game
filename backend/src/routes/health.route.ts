import { Router } from "express";
import controller from "../controllers/health.controller";

const router = Router();

router.get("/health", controller.get);

export default router;
