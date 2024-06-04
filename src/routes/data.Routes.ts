import { NextFunction, Request, Response, Router } from "express";
import { checkSSLMiddleware } from "../tools/middleware.tools";
import { checkPasswordByNameMiddleware } from "../tools/connection.tools";
import { dtoValidationMiddleware } from "../validation/dto";
import { CreateDataBody } from "../validation/dto/data.dto";
import { createMiddleware } from "../db/mongo/create.database";
import Data from "../db/mongo/models/log";
import { createChild } from "../worker";
import { join } from "path";

const router: Router = Router();
const child = createChild(join(__dirname, '../worker/producer.process.ts'));


router.use(checkSSLMiddleware())
router.use("/:name", checkPasswordByNameMiddleware())

router.post("/:name",
  dtoValidationMiddleware(CreateDataBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  // createMiddleware(["name", "ts", "value"], Data),
  // TODO: write a load balancing for this
  (req, res, next) => {
    // send message to child
    child.send({ type: 'data', data: req.body });
    return res.status(201).send();
  }
)

router.use("/:name", (req, res, next) => res.send(req.params.name));
export default router;
