import { InfluxDB } from '@influxdata/influxdb-client';

export default async function connectToInflux(url: string, token: string, org: string, bucket: string) {
  const client = new InfluxDB({ url, token });
  return client;
}
