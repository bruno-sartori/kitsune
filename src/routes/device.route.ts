import { Router } from "express";
import ColorController from "../controllers/device.controller";
import authMiddleware from "@middlewares/auth.middleware";

const router = Router();
const deviceController = new ColorController();

router.get('/available', authMiddleware, deviceController.getAvailableDevices);

export default router;
