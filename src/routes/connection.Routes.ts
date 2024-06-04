import { NextFunction, Request, Response, Router } from "express";
import { dtoValidationMiddleware } from "../validation/dto";
import { CreateConnectionBody, UpdateConnectionBody } from "../validation/dto/connection.dto";
import { createMiddleware } from "../db/mongo/create.database";
import Connection from "../db/mongo/models/connection";
import { readByIdMiddleware, readMiddleware } from "../db/mongo/read.database";
import { updateByIdMiddleware } from "../db/mongo/update.database";
import { deleteByIdMiddleware } from "../db/mongo/delete.database";
import { randomUuid } from "../tools/utils.tools";
import { checkPasswordByIdMiddleware, connectionNameBlackList } from "../tools/connection.tools";
import { existCheck } from "../tools/db.tools";
import { generateRandomString } from "../tools/util.tools";

const router: Router = Router();

router.post("",
  dtoValidationMiddleware(CreateConnectionBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  existCheck(Connection, { $or: [{ name: "name" }] }, "Connection with this name already exists!"),
  createMiddleware([{ "name": (body) => !body.name || connectionNameBlackList.includes(body.name) ? generateRandomString(4) : body.name }, "password"], Connection, { next: true, save: "doc" }),
  (req, res) => {
    if (!!req.session.connections) req.session.connections.push(req.body?.doc?.name);
    else req.session.connections = [req.body?.doc?.name];
    // req.session.save();
    return res.status(201).json({
      success: true,
      data: req.body?.doc?.toJSON(),
    });
  }
);
router.get("",
  readMiddleware(Connection, undefined),
);
router.get("/:id",
  readByIdMiddleware(Connection)
);
router.patch("/:id",
  dtoValidationMiddleware(UpdateConnectionBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  checkPasswordByIdMiddleware(),
  existCheck(Connection, { $or: [{ name: "name" }] }, "Connection with this name already exists!"),
  updateByIdMiddleware(Connection, {
    update: { "password": (payload) => payload["new_password"] }
  })
);
router.delete("/:id",
  dtoValidationMiddleware(UpdateConnectionBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  checkPasswordByIdMiddleware(),
  deleteByIdMiddleware(Connection) // delete also triggers the remove post function of Connection schema
);
export default router;
