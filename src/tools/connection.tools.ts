import { NextFunction, Request, Response } from "express";
import { ApiError } from "../types/classes/error.class";
import Connection from "../db/mongo/models/connection";


export function checkPasswordByIdMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.id || req.body.id;
    if (!id) return next(new ApiError(400, "Bad request"));
    const con = await Connection.findById(id).exec();
    if (req.session.connections?.includes(con?.name ?? '')) {
      if (!!req.session.connections) req.session.connections.push(con?.name ?? "dummy");
      else req.session.connections = [con?.name ?? "dummy"];
      return next();
    }
    if (!con) return next(new ApiError(404, "Connection not found"));
    if (!req.body.password) return next(new ApiError(400, "Bad request"));
    if (await con.checkPassword(req.body.password)) {
      if (!!req.session.connections) req.session.connections.push(con?.name);
      else req.session.connections = [con?.name];
      return next();
    }
    else return next(new ApiError(401, "Unauthorized"));
  }
}

export function checkPasswordByNameMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    let name: string = req.params.name || req.body.name;
    if (!name) return next(new ApiError(400, "Bad request"));
    const con = await Connection.findOne({ "name": name }).exec();
    if (req.session.connections?.includes(con?.name ?? '')) {
      if (!!req.session.connections) req.session.connections.push(name);
      else req.session.connections = [name];
      return next();
    }
    if (!con) return next(new ApiError(404, "Connection not found"));
    if (!req.body.password) return next(new ApiError(400, "Bad request"));
    if (await con.checkPassword(req.body.password)) {
      if (!!req.session.connections) req.session.connections.push(name);
      else req.session.connections = [name];
      return next();
    }
    else return next(new ApiError(401, "Unauthorized"));
  }
}


export const connectionNameBlackList = [
  "connection",
  "connections",
]