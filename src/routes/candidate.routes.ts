import { Router } from "express";
import { authenticate } from "../controllers/candidate/authentication.controller";
import { candidateAuthMiddleware } from "../middlewares/candidateAuthMiddleware";
import { stageStart, stageEnd } from "../controllers/candidate/stepController";

const router = Router();

router.post("/login", authenticate);

router.use(candidateAuthMiddleware);  // Apply authentication middleware to all routes below

router.post("/stageStart", stageStart);
router.post("/stageEnd", stageEnd);

export default router;