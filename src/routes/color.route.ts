import { Router } from "express";
import ColorController from "../controllers/color.controller";
import authMiddleware from "@middlewares/auth.middleware";

const router = Router();
const colorController = new ColorController();

router.post('/change', authMiddleware, colorController.changeColor);

export default router;
