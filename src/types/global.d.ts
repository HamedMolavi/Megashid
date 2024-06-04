import { InfluxDB } from "@influxdata/influxdb-client";

export { };
declare global {
  namespace NodeJS {
    interface Process {
      influxClient: InfluxDB
    }
    interface ProcessEnv {
      INFLUX_TOKEN: string
      INFLUX_URL: string
      PORT_HTTP: string
      PORT_HTTPS: string
      HOST: string
      BASE_URL: string
      MONGODB_URL: string
      REDIS_URL: string
      SESSION_SECRET: string
      NODE_ENV: "development" | "production"
      KAFKA_BOOTSTRAP: string
    }
  }
}
