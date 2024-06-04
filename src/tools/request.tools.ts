import { Router, Request, Response, NextFunction } from "express";
import { ApiError } from "../types/classes/error.class";
import mongoose, { FilterQuery } from "mongoose";
import { readMiddleware } from "../db/mongo/read.database";

export function injectDataMiddleware(fn: CallableFunction, options?: { params?: boolean, injData?: string, spread?: boolean }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!!options?.spread) {
        let result: Object = await fn(!!options?.params ? req.params : req.body)
        req.body = { ...req.body, ...result }
      } else {
        req.body[options?.injData || "injData"] = await fn(!!options?.params ? req.params : req.body);
      };
      next();
    } catch (error) {
      return next(new ApiError(500, "Internal Error!"));
    };
  };
};

export function DoNotAllowOnDefault(model: any, query: FilterQuery<any>) {
  return [
    readMiddleware(model, (search: string) => { return { _id: new mongoose.Types.ObjectId(search), ...query } }, { searchFromParams: (params) => params.id, next: true, save: 'docs' }),
    (req: Request, res: Response, next: NextFunction) => {
      if (!!req.body["docs"].length) {
        return next(new ApiError(403, "Can't change default " + model.collection.collectionName + "!"));
      };
      return next();
    }
  ];
};