import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { ApiError } from "../types/classes/error.class";

export function injectAllKindOfStuff(stuff: string[], field: string = "_id") {
  return (body: any) => stuff.reduce((acc, entity) => {
    acc[entity] = body[entity]?.reduce((obj: any, item: any) => ({ ...obj, [item[field].toString()]: item }), {});
    return acc;
  }, {} as Record<string, any>)
}

export function sendDataMiddleware(fn: CallableFunction, options?: { params?: boolean, forceAll?: boolean }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: any = await fn(!!options?.params ? req.params : req.body)
      if (!data) {
        return next(new ApiError(404, "Data not found!"));
      };
      //get page from url
      let strPage = req.query.page as string;
      let page = parseInt(strPage) > 0 ? parseInt(strPage) : 1;
      //get perPage from url
      let strPerPage = req.query.perPage as string;
      let perPage = strPerPage?.toLowerCase() === "all"
        ? 10000
        : parseInt(strPerPage) > 0 ? parseInt(strPerPage) : 1;
      let start = ((page > 1 ? page : 1) - 1) * perPage;
      let total = Object.prototype.hasOwnProperty.call(data, "length") ? data.length : undefined;
      if ((data.length ?? 0) > perPage && !options?.forceAll) data = data.slice(start, start + perPage);
      return res.status(200).json({
        success: true,
        data,
        page: page,
        perPage: perPage,
        total,
        pages: Math.ceil((total ?? 0) / perPage),
      });
    } catch (error: any) {
      return next(new ApiError(500, "Internal Error!" + error.message));
    };
  };
};


export function checkSSLMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    switch (req.protocol) {
      case "http":
        return res.redirect(`https://${req.headers.host?.split(":")?.[0] ?? 'localhost'}:${process.env["PORT_HTTPS"]}${req.originalUrl}`)
      case "https":
        return next();
      default:
        return next(new ApiError(500, "Internal server error"));
    }
  }
}