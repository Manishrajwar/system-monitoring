import { Router } from "express";
import monitorController from "../controller/monitorController.js";

const router = Router();

router.route("/metric").get(monitorController.getMetrics)

router.route("/monitor").get(monitorController.monitor)

export default router;