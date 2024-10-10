import { Router } from "express";
import GoogleHomeController from "../controllers/google-home.controller";
import authMiddleware from "@middlewares/auth.middleware";

const router = Router();
const googleHomeController = new GoogleHomeController();

router.post('/intent', googleHomeController.execIntent);

export default router;
