import { Router } from "express";
import DeviceController from "../controllers/device.controller";
import authMiddleware from "@middlewares/auth.middleware";

const router = Router();
const deviceController = new DeviceController();

router.use(deviceController.init);
router.get('/available', authMiddleware, deviceController.getAvailableDevices);

export default router;
