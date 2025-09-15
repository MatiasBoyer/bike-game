import { Router } from "express";
import rt_health from "../routes/health.route";
import mw_errorhandler from "../middlewares/errorhandler.middleware";

const router = Router();

router.use(rt_health); // health router

export default router;
