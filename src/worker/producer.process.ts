import { Kafka, logLevel } from "kafkajs";
import { generateRandomString } from "../tools/util.tools";

const kafka = new Kafka({
  clientId: 'backend',
  brokers: (process.env.KAFKA_BOOTSTRAP ?? "localhost:9092").split(','),
});

const producer = kafka.producer({
  retry: {
    restartOnFailure: async (err) =>
      !Boolean(console.log("Kafka Connect Failure:", err)),
  },
  allowAutoTopicCreation: true, // TODO: should be false.
});

async function run() {
  await producer.connect();
  process.on('message', (msg: Object & { type: string, data: any }) => {
    switch (msg.type) {
      case "data":
        const data = { ...msg.data, _id: generateRandomString(16) };
        const sentData = Buffer.from(JSON.stringify(data), "utf8");
        producer.send({
          topic: "data",
          messages: [
            {
              key: data.ts.toString(),
              value: sentData,
            }
          ],
          acks: 0,
        });
        return

      default:
        break;
    }
  });
  // send message to the parent
  // process.send?.({ foo: 'bar', baz: NaN });
};

run();
