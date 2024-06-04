import { NextFunction, Request, Response, Router } from "express";
import { InfluxDB } from "@influxdata/influxdb-client";
import { ApiError } from "../types/classes/error.class";

const client = new InfluxDB({ url: 'http://localhost:8086', token: process.env["INFLUX_TOKEN"] });
const queryApi = client.getQueryApi('Megashid');


const router: Router = Router();

router.get("",
  (req, res, next) => {
    const { start, stop, name } = req.query;
    if (!start || !stop || !name) return next(new ApiError(400, "Bad Request"));
    const query = `from(bucket: "test")
    |> range(start: ${start}, stop:${stop})
    |> filter(fn: (r) => r["_measurement"] == "mem" and r["_field"] == "${name}")`;

    let data: { [key: string]: any; }[] = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        data.push(tableMeta.toObject(row))
      },
      error(error) {
        return next(new ApiError(400, "Bad Request"));
      },
      complete() {
        return res.send({
          success: true,
          data
        })
      },
    })
  }
)

export default router;
