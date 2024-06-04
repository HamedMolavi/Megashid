import { Kafka, logLevel } from "kafkajs";
import { generateRandomString } from "../tools/util.tools";
import { Point, WriteApi } from '@influxdata/influxdb-client';
import connectToInflux from "../db/influx/connect.database";

const kafka = new Kafka({
  clientId: 'backend',
  brokers: (process.env.KAFKA_BOOTSTRAP ?? "localhost:9092").split(','),
  logLevel: logLevel.ERROR
});
const consumer = kafka.consumer({
  groupId: "backend",
  retry: {
    // Try to reconnect after 10 sec
    initialRetryTime: 10 * 1000,
    retries: 10,
  },
  heartbeatInterval: 25000,
});
let interval: NodeJS.Timeout;


async function runConsumer() {
  process.on('message', async (msg: Object & { type: string, data: any }) => {
    switch (msg.type) {
      case "command": {
        if (msg.data.command === "start") {
          const client = await connectToInflux(process.env["INFLUX_URL"] ?? "", process.env["INFLUX_TOKEN"] ?? "", 'Megashid', 'test');
          const writeApi = client.getWriteApi('Megashid', 'test').useDefaultTags({ host: 'host1' });
          interval = setInterval(() => writeApi.flush(), 2000);
          await consumer.connect();
          // Subscribe to topics
          await consumer.subscribe({
            topic: 'data',
            fromBeginning: false
          });
          await consumer.run({
            eachMessage: async ({ message }) => {

              // send message to the parent
              // process.send?.({ foo: 'bar', baz: NaN });
              const key = message.key?.toString("utf-8");
              const value = message.value?.toString("utf-8");
              if (!!value) {
                const jsonValue = JSON.parse(value);
                try {
                  const point = new Point('mem') // 'test' table
                    // .tag("_id", jsonValue._id)
                    .floatField(jsonValue.name, parseFloat(jsonValue.value)) // column 'name' value 'value'
                    .timestamp(""); //jsonValue.ts
                  writeApi.writePoint(point);
                  // await writeApi.close();
                } catch (error) {
                  console.error(error)
                }
              }
            }
          })
        } else if (msg.data.command === "stop") {
          // if (!!writeApi) await writeApi.close();
          await consumer.stop();
          clearInterval(interval);
        }
        break;
      }
    }
  })
}

runConsumer();
