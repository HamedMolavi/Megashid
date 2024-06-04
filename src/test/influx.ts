import { InfluxDB, HttpError, Point } from "@influxdata/influxdb-client";
const token = 'F_y7me1fMg9n4ZxUDzwq-UNZdHr1SSqi3WxgRD4me1ja-ZKb6S3Btf2toqbWUeg7jnobLHsWfL3Nv5Vr5NJdxA=='
const org = 'Megashid'
const bucket = 'test'

const client = new InfluxDB({ url: 'http://localhost:8086', token: token })
const queryApi = client.getQueryApi(org)

const query = `from(bucket: "${bucket}")
|> range(start: -24h)
|> filter(fn: (r) => r._measurement == "mem")`;

queryApi.queryRows(query, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row)
    console.log(
      `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
    )
  },
  error(error) {
    console.error(error)
    console.log('\nFinished ERROR')
  },
  complete() {
    console.log('\nFinished SUCCESS')
  },
})
