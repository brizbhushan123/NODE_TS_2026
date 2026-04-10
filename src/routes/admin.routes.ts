import { Router } from "express";
import { createClient } from "../controllers/admin/client.controller";

const router = Router();

router.post('/create-client', createClient);

export default router;