import { NextFunction, Request, Response, Router } from "express";
import connectionRouter from "./connection.Routes";
import measurementRouter from "./measurement.Routes";
import dataRouter from "./data.Routes";

const router: Router = Router();

router.use("/connection", connectionRouter);
router.use("/measurement", measurementRouter);

router.use(dataRouter)

export default router;
